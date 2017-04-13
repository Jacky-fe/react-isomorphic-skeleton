#react-isomorphic-skeleton
##0.0.3 changelog
入门同学推荐使用[Next.js](https://github.com/zeit/next.js)这种上手容易，但灵活度有欠缺，它自己高度封装

1. 支持css moduler；
2. 支持className不可变的第三方ui框架如antd；
3. 支持sass；
4. 支持微信全版本（微信android版的坑已经帮你趟过了）。



建议使用sass取代"Aphrodite for CSS"

## Description
这是一个全功能的react同构脚手架，它有你想要的一切：

1. 每个路由的组件和逻辑都放在了单独的文件夹，便于以后单独提出；
2. 做到了服务端同构渲染；
3. 做到了html, css, js的根据路由按需加载；
4. 比较纯净，没有太多的轮子；
5. 集成了react-redux和react-router；
6. 支持hot-replace;
7. 同时支持使用[Browsersync](https://browsersync.io)进行真机调试；
8. 集成antd框架并支持最小化编译输出，参见src/components/app；
9. 集成Helmet防范xss攻击。



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




