/**
 * 在 AJ 中 引入
 *
 * @example
 *  let aj = require("./runtime/runtimeAj.js"); // 引入模块
 *  aj.initUi("./web/index.html"); // 初始化 UI
 */

// 安卓官方接口说明文档 :
// https://developer.android.google.cn/reference/android/webkit/WebViewClient

// AJ 调用 java
// https://p-bakker.github.io/rhino/tutorials/scripting_java/

/**
 * 初始化 UI
 * @param {string} htmlPath html文件的地址
 */
function initUi(htmlPath) {
  ui.layout('<webview id="web" h="*" w="*"  />');
  webviewInit(ui.web);
  let path = "file:" + files.path(htmlPath);
  ui.web.loadUrl(path);
}

/**
 * 执行 js
 * @template T
 * @param {*} webViewWidget webview对象
 * @param {string} script 脚本
 * @param {(data:T)=>void} callback 回调函数
 */
function callJs2(webViewWidget, script, callback) {
  try {
    console.assert(webViewWidget != null, "webView控件为空");
    //runtimeLog(script.toString())
    webViewWidget.evaluateJavascript(
      "javascript:" + script,
      new JavaAdapter(android.webkit.ValueCallback, {
        onReceiveValue: (val) => {
          if (callback) {
            callback(val);
          }
        },
      })
    );
  } catch (e) {
    console.error("执行JavaScript失败");
    console.trace(e);
  }
}

/**
 * 执行 js
 * @template T
 * @param {string} code 欲执行的js代码
 * @param {(data:T)=>void} callback 回调函数
 */
function callJs(code, callback) {
  callJs2(ui.web, code, callback);
}

/**
 * 执行 autojs
 */
function callAutojs(cmd, args) {
  let ret;
  // 执行 js代码
  if (args == "[code]") {
    ret = eval(cmd); // 可以改为 new Function()
  } else {
    // 从全局获取即将调用的函数
    /** @type {Function} */
    let fn = globalThis[cmd];
    if (!fn) {
      throw new Error("cmd= " + cmd + " 没有定义实现");
    }
    // 判断参数类型
    if (Array.isArray(args)) {
      ret = fn.apply(globalThis, args);
    } else {
      ret = fn.call(globalThis, args);
    }
  }
  return ret;
}

function webviewInit(webViewWidget) {
  webViewWidget.webViewClient = new JavaAdapter(android.webkit.WebViewClient, {
    /** 页面开始加载, 此时还没有加载 index.html 中的代码 */
    onPageStarted: (webView, url, favicon) => {},
    /** 页面加载完成, 在 window.onload 之后触发 */
    onPageFinished: (webView, curUrl) => {},
    onReceivedError: (webView, webResourceRequest, webResourceError) => {
      let url = webResourceRequest.getUrl();
      let errorCode = webResourceError.getErrorCode();
      let description = webResourceError.getDescription();
      console.trace(errorCode + " " + description + " " + url);
    },
  });
  webViewWidget.webChromeClient = new JavaAdapter(android.webkit.WebChromeClient, {
    /** 拦截 web console 消息 */
    onConsoleMessage: (consoleMessage) => {
      /**@type {string} */
      let msg = consoleMessage.message();
      let sourceId = consoleMessage.sourceId().split("/");
      let sourceIdStr = sourceId[sourceId.length - 1];
      let lineNumber = consoleMessage.lineNumber();
      let msgLevel = consoleMessage.messageLevel();

      if (msg.indexOf("jsbridge://") == 0) {
        let uris = msg.split("/");

        /** @type {{cmd:string,callId:number,args:any}} */
        let data = JSON.parse(java.net.URLDecoder.decode(uris[2], "UTF-8"));
        let cmd = data.cmd;
        let callId = data.callId;
        let args = data.args;
        runtimeLog("⭐ AJ 收到调用请求:", JSON.stringify(data));
        let result = null;
        try {
          result = callAutojs(cmd, args);
        } catch (e) {
          console.trace(e);
          result = {
            message: e.message,
          };
        }       

        let callbackArgs = {
          callId: callId,
          args: result,
        };

        // 调用 web , 完成回调
        callJs(["auto.callback(", JSON.stringify(callbackArgs), ")"].join(""));
      } else {
        runtimeLog("📖 浏览器日志: %s [%s:%s] %s ", msgLevel, sourceIdStr, lineNumber, msg);
      }
    },
  });
}

/**
 * 框架 log
 * @description 注释方法中的代码就可以关闭所有的框架日志了.
 */
function runtimeLog() {
  console.log.apply(this, arguments);
}

module.exports = {
  initUi: initUi,
  callJs2: callJs2,
  callJs: callJs,
  callAutojs: callAutojs,
  webviewInit: webviewInit,
  runtimeLog: runtimeLog,
};
