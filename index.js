$("#btn").click(function () {
  startPromise(() => {
    //用来测试 web调用aj
    $("#btn").text(getAj("getName", ["我是谁", 2, 34]));
  });
});

/**
 * 接收aj 返回值并显示到 html页面上 (用来测试 aj调用web)
 * @param  {...any} arr
 */
function pushLog(...arr) {
  $("#showLog").append("<br/>----<br/>");
  for (let key of arr) {
    $("#showLog").append(key + "<br/>");
  }
}

//------------
//------------
//------------
//------------
//------------
//------------
//------------
//------------
//#region 调用 aj

/**
 * 创建一个 异步方法 (不卡界面)
 * @param {Function} func 要执行的方法体
 */
function startPromise(func) {
  new Promise((res) => {
    res("success");
  }).then((value) => {
    func();
  });
}

/**
 * 调用java
 * @param {string} functionName 方法名
 * @param {any} arrParam 参数
 * 单个参数直接传
 * web: getAj ("getUserName",1)           aj: function getUserName(p1) { return p1+1;}
 * 多个参数建议用数组
 * web : getAj ("getUserName",[1,3,4])    aj: function getUserName([p1,p2,p3]) { return p1+p2+p3; }
 */
function getAj(functionName, arrParam) {
  let res = undefined;
  try {
    res = prompt(functionName, JSON.stringify(arrParam));
  } catch (error) {
    layToast(error);
  }
  return res;
}

/**
 *  html lay toast弹窗
 * @param {any} msg
 */
function layToast(msg) {
  layer.msg(msg);
}

/**
 *  aj toast
 * @param {any} msg
 */
function toast(msg) {
  getAj("ajToast", msg);
}

/**
 *  aj log
 * @param {any} msg
 */
function log(msg) {
  getAj("log", msg);
}

//#endregion
