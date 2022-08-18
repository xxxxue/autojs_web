// @ts-check
/**
 * 
 * 在 web 中引入  
 * <script src="runtime.js"></script>
 * 
 * 然后实例化 
 * let auto = new AutoX();
 * 
 */


/**
 * Web 与 AJ 通讯
 * @example
 * let auto = new AutoX();
 */
function AutoX() {
  this._callbackStore_ = {};
  this._callbackCounter_ = 0;
}

/**
 * 保存回调函数,等待调用
 * @template T
 * @param {(data:T)=>void} callback 
 * @returns 
 */
AutoX.prototype._setCallback_ = function (callback) {
  this._callbackCounter_++;
  this._callbackStore_[this._callbackCounter_] = callback;
  return this._callbackCounter_;
};

/**
 * 查找 回调函数
 * @template T
 * @param {number} callId
 * @returns {(data:T)=>void}
 */
AutoX.prototype._getCallback_ = function (callId) {
  let callback = this._callbackStore_[callId];
  if (callback) {
    delete this._callbackStore_[callId];
  }
  return callback;
};

/**
 * web 调用 AJ
 * @template T
 * @param {string} cmd 
 * @param {*} args
 * @param {(data:T)=>void} callback 
 */
AutoX.prototype.invoke = function (cmd, args, callback) {
  let callId = -1;
  try {
    callId = this._setCallback_(callback);
    let data = JSON.stringify({
      cmd: cmd,
      args: args,
      callId: callId,
    });

    // 传给 aj
    console.log("jsbridge://" + encodeURIComponent(data));
  } catch (e) {
    console.trace(e);
  }
};

/**
 * AJ 回调入口
 * @template T
 * @param {{callId:number,args:T}} data
 */
AutoX.prototype.callback = function (data) {
  let callId = data.callId;
  let args = data.args;
  
  let callbackFun = this._getCallback_(callId);
  if (callbackFun) {
    // 调用
    callbackFun(args);
  }
};

/**
 * 执行 aj 代码
 * @template T
 * @param {string} code 
 * @param {(res:T)=>void} callback
 */
AutoX.prototype.execAjCode = function (code, callback) {
  // 利用特殊标识, 让 aj 去判断, 执行特殊的逻辑
  this.invoke(code, "[code]", callback);
};



//#region Utils 工具类

/**
 * 日志
 * 多参日志，aj拦截不全，所以手动拼成一个字符串
 */
 let log = function (...args) {
  let data = args.join(" ");
  console.log(data);
};

//#endregion