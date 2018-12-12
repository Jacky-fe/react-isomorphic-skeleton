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

|--------components post路由的组件列表

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

|----fake-db.js 模拟了一个db，演示用，后期可以删除

|----server.js 服务端主入口，通常不用动

|----store.js store文件，通常不用动





## 相关学习
[React SSR原理](./principle.md)