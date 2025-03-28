
// let vConsole = new VConsole();

// 建议:
// 写代码的时候, 同时打开 runtimeWeb.js 和 runtimeAj.js 文件, 
// 这样 VSCode 就可以分析所有打开的文件代码, 来给出 js 智能提示和代码分析,开发效率更高,
let auto = new AutoX();

//初始化vue3
let vueObj = Vue.createApp({
  setup() {
    //vue3 定义属性 (双向绑定)
    let state = Vue.reactive({
      demoValues: {
        v1: "",
        v2: "",
        v3: "",
        v4: "",
      },
      tabbarActive: "home",
      popopShow: false,
      dataList: [],
      msgList: [],
      version: "",
    });

    let checkClick = () => {
      // 获取 userAgent
      state.version = navigator.userAgent;
    };
    //vue3 定义方法
    let testClick = () => {
      //   vant.Toast("我是 vant Toast");
      state.popopShow = true;

      /**
       * 可以把 请求 AJ 的方法, 封装到单独的一个 js 中. 方便管理这些硬编码
       *
       * 所有的 回调 都是可以省略的,这里只是为了测试, 所以都写上了
       */

      // 测试 单个参数， 直接调用 aj 的 toast
      auto.invoke("toast", "哈哈哈");

      auto.invoke("ajFun0", (r) => {
        // 由于 ajFun0 没有 return 返回值, 所以这里就不会调用了.
        log("ajFun0 回调:", typeof r, r);
      });

      auto.invoke("ajFun1", undefined, (r) => {
        log("ajFun1 回调:", typeof r, r);
      });

      auto.invoke("ajFun2", "小乌龟", (r) => {
        log("ajFun2 回调:", typeof r, JSON.stringify(r));
      });

      auto.invoke("ajFun3", undefined, (r) => {
        log("ajFun3 回调:", typeof r, JSON.stringify(r));
      });

      // 测试 多个参数
      auto.invoke("ajFun4", ["我是web", true, 32], (r) => {
        log("ajFun4 的返回值:", typeof r, JSON.stringify(r));
        state.dataList = r;
      });

      /**
       * 直接执行 aj 代码 , aj也可以反向的执行 web 的代码 ,
       *
       * 当然 上面的那几个 invoke 例子, 也可以用 execAjCode 来实现
       *
       * auto.execAjCode("ajFun4('我是web',true,32)",(r)=>{ })
       */
      auto.execAjCode("files.read('./web/index.html')", (r) => {
        log("执行 aj 代码 files.read 回调:", typeof r, "数据长度:", r.length);
        state.msgList.push(r);
      });
    };

    let tabbarOnChange = (itemName) => {
      vant.Toast(itemName);
      state.tabbarActive = itemName;
    };
    Vue.onMounted(() => {
      // 如果 html 加载太快了. 可以用  setTimeout 来延时一下这里, 防止闪烁 体验差
      document.getElementById("loading").style.display = "none";
      document.getElementById("app").style.display = "block";
    });

    return {
      ...Vue.toRefs(state),
      testClick,
      checkClick,
      tabbarOnChange,
    };
  },
})
  .use(vant) // 注册vant组件
  .use(vant.Lazyload)
  .mount("#app"); //挂载到 id='app'

//------------
//------------
//------------

/**
 * 测试 aj调用 web
 * @param data
 * @param callBack
 */
let testAJ2Web = (data) => {
  log("testAJ2Web 被aj调用了,参数:", data);

  //测试外部 更改 属性值
  vueObj.msgList.push(...data);

  return "hh";
};
