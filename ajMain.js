"ui";
//-------------
//#region  web 部分
//---------------------------------------
//----web start--------------------------
//---------------------------------------

importClass(android.webkit.WebView);
importClass(android.webkit.ValueCallback);
importClass(android.webkit.WebChromeClient);
importClass(android.webkit.WebResourceResponse);
importClass(android.webkit.WebViewClient);
importClass(android.webkit.WebSettings);
ui.layout(
  '<ScrollView w="*" h="*"><webview id="web" h="*" w="*"  /></ScrollView>'
);

let web = ui.web;

var set = web.getSettings();

set.setAllowFileAccess(true);
set.setAllowFileAccessFromFileURLs(true);
set.setAllowUniversalAccessFromFileURLs(true);

set.setDisplayZoomControls(false);
set.setSupportZoom(false);
set.setJavaScriptEnabled(true);

set.setTextZoom(100);
set.setUseWideViewPort(true);
set.setLoadWithOverviewMode(true);
set.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.SINGLE_COLUMN);
//set.setDomStorageEnabled(true);

web.setWebChromeClient(
  new JavaAdapter(WebChromeClient, {
    onJsPrompt: function (view, url, fnName, defaultValue, jsPromptResult) {
      let result = undefined;
      console.log("接收到promtp: ", fnName, defaultValue);
      try {
        result = eval(fnName + "(" + defaultValue + ")");
      } catch (error) {
        console.trace(error);
      }
      jsPromptResult.confirm(result);
      return true;
    },
  })
);

//加载html
web.loadUrl("file://" + files.path("./index.html"));

/**
 * 执行js的方法
 * @param {string} fnName 方法名
 * @param {*} arr 参数
 */
function runJsFunction(fnName, arr) {
  web.loadUrl("javascript:" + fnName + "(..." + JSON.stringify(arr) + ")");
}
/**
 * 提供给web调用的log
 * @param {*} msg
 */
function log(msg) {
  console.log(msg);
}
/**
 * 提供给web调用的log
 * @param {*} msg
 */
function ajToast(msg) {
  toast(msg);
}
//---------------------------------------
//-----web end---------------------------
//---------------------------------------
//#endregion

//-------------
//-------------
//-------------
//-------------
//-------------
//-------------
//-------------
//-------------

/**
 * 用来测试 web 调用 aj
 */
function getName([index, name, age]) {
  console.log("方法参数: ", index, name, age);

  //测试 aj调用web
  runJsFunction("pushLog", ["我是1", "我是2", "我是3"]);

  return index + name + age;
}
