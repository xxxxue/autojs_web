# autojs_web

> 使用 `html / css / js` 作为 autojs 的界面，可以互相通讯

> 当然也可以用前端框架

## 🚀 如果你需要编写 复杂的项目 与 界面

推荐使用 🚀 [https://github.com/xxxxue/autox-super-kit](https://github.com/xxxxue/autox-super-kit)

- 使用 Web 框架编写界面 ( react / vue 等 ), 也支持 auto.js 原生界面的编写
- auto.js 语法支持 ES6+ (各种 js 现代语法)
- 使用 TypeScript 编写代码
- 可以编译为 Dex
- ......

## 适用范围

使用 `Rhino` 引擎的 auto.js 都能用 (包括 autoX 等等)

## 重要说明

由于 aj 会在打包的时候把所有 .js 文件进行加密, 

但 浏览器 无法识别这种加密,

所以浏览器端的 .js 需要改为 `.jsx` , 来跳过 aj 的加密. 

这样浏览器才能正确识别 js 代码

## 使用

在 VSCode 中 打开 `autojs-project` 目录，按 `Ctrl + Shift + P`，

选择 `运行项目(Run Project)` 命令，

Auto(X).js 插件会找 `根目录下的 Project.json`

代码中有例子 ( vue3 + vant )，可以直接进行测试。

## 灵感来源

这一套逻辑的灵感来源于 AutoX.js 示例

但 示例 中有许多不完美的地方 和 bug 

比如 AutoX 中是创建了一个 iframe 并拦截 `shouldOverrideUrlLoading` 事件

这个事件经过测试是 无法并发响应, 

比如 在一个按钮点击事件中 顺序调用多个`invoke`, 只有最后一个会生效,

前面的几个调用都没有任何反应.

所以改为 拦截 `onConsoleMessage` 也就是 `console.log` 事件

这样就支持了 并发响应,

然后 再优化 亿点代码. 最终就有了这个新版.

## 交流

[https://github.com/xxxxue/sponsors](https://github.com/xxxxue/sponsors)

## 截图

<img src="img.assets/image-20211012135328926.png" width="300px">

<img src="img.assets/image-20211012135349423.png" width="300px">

<img src="img.assets/image-20220818192132429.png" width="300px">

<img src="img.assets/image-20220818191800397.png" width="300px">
