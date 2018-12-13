# react-isomorphic-skeleton

## Description
这是一个全功能的react同构脚手架，它有你想要的一切：

[文档](./docs/startup.md)

1. 每个路由的组件和逻辑都放在了单独的文件夹，便于以后单独提出；
2. 做到了服务端同构渲染；
3. 做到了html, css, js，route，reducer的coder split；
4. 比较纯净，没有太多的轮子；
5. 集成了react-redux和react-router（3.2）；
6. 支持hot-replace;
7. 同时支持使用[Browsersync](https://browsersync.io)进行真机调试；
8. 集成antd框架并支持最小化编译输出，参见src/components/app；
9. 集成Helmet防范xss攻击；
10. 支持scss；
11. 兼容腾讯X5浏览器；
12. 支持className不可变的第三方ui框架如antd按需加载, 参见src/components/app；
13. 支持css moduler;

与[Next.js](https://github.com/zeit/next.js)不同的是
1. css更好用，支持scss，less等直接引用；
2. 组件级别支持服务端渲染；

##注意
node.js 版本 > 5.5

npm版本 > 3.0
##用法


git clone https://github.com/Jacky-fe/react-isomorphic-skeleton

cd react-isomorphic-skeleton

npm install

npm start 

##感谢 & 相关项目
代码文件基于[React Production Starter](https://github.com/jaredpalmer/react-production-starter)

编译脚本文件基于[React Start Kit](https://github.com/kriasoft/react-starter-kit)




