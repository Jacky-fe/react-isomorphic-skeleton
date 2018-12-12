[起步](./startup.md)
# 服务端渲染原理
JSX编译后是一堆createElement，在客户端会通过FIber引擎构建一套复杂的渲染调度机制及虚拟Dom来保证高效的渲染，在React v16服务端渲染则非常简单：

服务端通过ReactDOMServerRenderer.renderDOM方法直接将reactElement渲染成字符串

没错，就是递归的方式，不过用了stack来优化了递归的性能

renderDOM将element分成了out和footer，这样利用stack的后进先出很好的实现了一层一层的元素渲染.
这样做的好处是：
1. 去掉了在内存里维护一个复杂的vitural dom tree，节省服务端资源；
2. 去掉了react15里复杂的计算签名和验算签名的方式，大大提高了渲染效率；

所以：
1. 服务端是没有和客户端一样的虚拟Dom树机制的；
2. 组件的生命周期，只有createElement里触发的，一个是constuctor，一个是willMount，在willMount里调用setState是同步有效的，如果用setTimeout或Promise.then则无效，因为进入了下一个macrotasks/microtasks循环；
3. 调用react-dom-server的renderToXXX方法，是一次性操作。

[10分钟了解服务端数据预取和服务端渲染](./prefetch.md)


