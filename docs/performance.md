[起步](./startup.md)
## 首屏渲染
1. 可预期不在首屏的内容，我们在开发时就能确定它不在首屏；

利用[clientOnlyComponent](../src/utils/client-only.js)将不在首屏的组件包一下即可。

2. 不可预期在首屏的内容，例如动态列表：

可以在index > 某个值的时候使用[clientOnlyComponent](../src/utils/client-only.js)包一下


## 可见区域渲染

建议结合首屏渲染的方案

剩下的使用[react-lazyload](https://github.com/jasonslyvia/react-lazyload)将其封装

## 可见区域懒加载

可以使用[react-loadable-visibility](https://github.com/stratiformltd/react-loadable-visibility/)封装
