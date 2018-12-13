# 起步
``` shell
git clone https://github.com/Jacky-fe/react-isomorphic-skeleton

cd react-isomorphic-skeleton

npm install

npm start 
```

项目启动后会自动在你的浏览器端打开站点

## 项目结构介绍

|--src

|----api  mock示例接口 后期可删除

|----components 通用组件

|----middleware redux的中间件 通常不用动

|----routes 路由  **新增各种页面都在这里做**

|------post 帖子详情页，**一个异步加载+异步reducer+ssr的例子**

|--------components post路由的组件列表（路由内通用）

|--------containers post路由的组件列表（页面级）

|--------actions.js redux的actions

|--------index.js 路由描述文件

|--------reducer.js redux的reducer

|------post-list 帖子列表 **一个服务端渲染的列表例子**

|------about 关于，**一个完全采用客户端渲染的例子**

|------root.js 添加路由之后，需要在这里增加路由描述

|----static 静态文件存放处，没用可以删除，对应server.js里的静态路由代码也要删

|----thirdpart (空)，可以用来放一些第三方的css文件，会采取{ module: false }的方式编译

|----utils

|------client-only.js 一个clientOnly的装饰器，可以用来标明此组件仅在客户端渲染

|------combine-component.js 将组件与reducer捆绑在路由上

|------convert-loadable-components 将react-loadable组件转化成普通组件

|------http-client.js http请求库，针对服务端请求做了特殊的封装

|----views ejs模版，用处不大，只有个error.ejs可能会用到

|----client.js 客户端主入口 通常不用动

|----config.js 配置文件，从../config复制而来 

|----constants.js 放置各种常量，建议放置各种action type

|----create-reducer.js createReducer方法 通常不用动

|----server.js 服务端主入口，通常不用动

|----store.js store文件，通常不用动

## 快速开始
[创建一个标准的按需加载+服务端渲染+数据预取的React+Redux页面](./standard-page.md)
[创建一个纯客户端渲染页面](./client-only-page.md)
[网络请求](./network.md)

## 配置
[config.js](./config.md)

## 更多配置
可自行修改[webpack.config.js](.,/tools/webpack.config.js)

## 注意事项
1. 在客户端，我们使用ajax请求时，会自动带上referer, cookie，nginx也会加上来源ip等信息。在服务端这些都是没有的，需要将客户端的信息带过去。因此我们封装了http-client.js；参考[网络请求](./network.md)
2. 有些组件如果在编写时没有考虑过SSR，想转换他们是比较麻烦的，可以使用ClientOnlyComponent(XXX)将它转化成一个纯客户端组件，这样它就只在客户端渲染了。参考[创建一个纯客户端渲染页面](./client-only-page.md)
3. 由于browserHistory监控了全局的HistoryApi，所以无法被释放，在热更新后会造成n次调用redial里的钩子，n=热更新次数。如果很介意可以手动刷新页面

## 进阶
[React SSR原理](./principle.md)
[10分钟了解服务端数据预取和服务端渲染](./prefetch.md)
[代码切割](./code-split.md)
