#react-isomorphic-skeleton
##0.0.3 changelog


1. support dynamc classname for css file
2. enhance style compatibility of third part ui framework such as antd
3. support css & sass and always support split them



From this version i recommend use css or sass instead of "Aphrodite for CSS"

## Description
这是我认为目前最适合我现在负责项目的架构，它有我想要的一切。它有以下特点

1. 每个路由的组件和逻辑都放在了单独的文件夹，便于以后单独提出；
2. 做到了服务端同构渲染；
3. 做到了html, css, js的根据路由按需加载；
4. 比较纯净，没有太多的轮子；
5. 集成了react-redux和react-router；
6. 支持react-hot；
7. 支持使用[Browsersync](https://browsersync.io)进行调试；
8. 数据获取服务端和客户端用法一致；
9. 常见的优化，编译功能
10. 代码写法与react-native相似


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




