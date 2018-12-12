[10分钟了解服务端数据预取和服务端渲染](./prefetch.md)
# 代码切割
## js切割
js代码比较简单，通过React-Loadable即可实现
```js
import Loadable from 'react-loadable';
import Loading from 'components/loading';

export default {
  path: 'about',
  component: Loadable({
    loader: () => import('./components/about'),
    loading: Loading,
  })
};
```
有个比较麻烦的细节是异步加载reducer
### reducer切割
#### 通过占位空Reducer， 解决“Unexpected key "xxx" found in preloadedState”
根据redux的官方文档，我们似乎通过这样几步就可以异步加载reducer了
``` js
 store.injectAsyncReducer = function(name, asyncReducer){
    this.asyncReducers[name] = asyncReducer;
    this.replaceReducer(createReducer(this.asyncReducers));
};
```
然而理想与现实还是有差距的，服务端渲染的数据，如果没有对应的reducer处理，会报一个“redux.js?7276:307 Unexpected key "xxx" found in preloadedState argument passed to createStore. Expected to find one of the known reducer keys instead: "xxx". Unexpected keys will be ignored.”的警报，在某些浏览器会直接挂掉。

所以我们要稍微做一下处理，用一个空reducer占位，然后再替掉它
``` js
  const emptyReducer = (state = {}) => state;
  emptyReducer.isEmpty = true;
  const initialReducers = {};
  for(const key in initialState) {
    // 注入空reducer，以免报“Unexpected key "xxx" found in previous state”
    initialReducers[key] = emptyReducer;
  }
```
#### 在路由里拿到store，进行replaceReducer
1. 创建路由
``` js
const store = configureStore(initialState);
function createRoutes(store) {
  const root = {
    path: '/',
    component: App,
    childRoutes: [
      Post(store),
    ],
    indexRoute: {
      component: PostList,
    },
  };
  return root;
}
const routes = createRoutes(store);
```
2. 在路由里绑定reducer和组件
``` js
import Loadable from 'react-loadable';
import Loading from 'components/loading';
import combineComponent from 'utils/combine-component'
export default function(store) {
  return {
    path: 'post/:slug',
    component: Loadable({
      // 这个函数将异步的组件和reducer进行了绑定
      loader: combineComponent(
        () => import('./containers/post-page'),
        () => import('./reducer'), 
        store,
        'currentPost'
      ),
      loading: Loading,
    })
  };
}
```
3. combineComponent实现
``` js
export default function (componentRequest, reducerRequest, store, stateKey) {
  return async () => {
    const [component, reducer] = await Promise.all([componentRequest(), reducerRequest()]);
    store.injectAsyncReducer(stateKey, reducer.default);
    return component;
  }
}
```
## css切割
css切割目前最好的还是react-loadable全家桶，我们需要在server端找到这些js引用的css模块，然后在返回的html里输出
1. css-loader增加ExtractCssChunks.loader
``` js
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
 {
  test: /\.css$/,
  use: [
    ExtractCssChunks.loader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: false,
        minimize: !DEBUG,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: loader => defaultPostcss(loader),
      },
    },
  ],
}
```
2. 客户端和服务端plugins增加ExtractCssChunks
``` js
  // css切割
  new ExtractCssChunks({
    filename:'[name].[contenthash].css',
    chunkFilename: '[name].[contenthash].css',
    hot: true, // if you want HMR - we try to automatically inject hot reloading but if it's not working, add it to the config
    orderWarning: true, // Disable to remove warnings about conflicting order between imports
    reloadAll: true, // when desperation kicks in - this is a brute force HMR flag
    cssModules: true, // if you use cssModules, this can help.
  }),
```
3. 使用react-loadable/babel记录模块与css对应关系，使用ReactLoadablePlugin输出到它们到文件备用
``` js
import { ReactLoadablePlugin } from 'react-loadable/webpack';
plugins: [
  'syntax-dynamic-import',
  ['import-inspector', {
    'serverSideRequirePath': true,
  }],
  'react-loadable/babel',
  'transform-runtime',
  'transform-decorators-legacy',
  [
    'antd',
    {
      'style': 'true',
    },
  ],
]

plugins: [
  ...
   new ReactLoadablePlugin({
      filename: path.resolve(__dirname, '../dist/loadable.json'),
    }),
    ...
]
```
4. 在server端，通过Loadable.Capture捕获用到的模块，再拿这些模块在之前生成的“loadable.json"里找到对应的模块信息
``` js
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
const modules = [];
const InitialView = (<Loadable.Capture report={moduleName => modules.push(moduleName)}>
  <Provider store={store}>
    <RouterContext {...renderProps} />
  </Provider>
</Loadable.Capture>);
const data = ReactDom.renderToString(InitialView);
const allBundles = getBundles(stats, modules);
const cssBundles = [];
const jsBundles = [];
allBundles.forEach(item => item.file.endsWith('.css') ? cssBundles.push(item.publicPath) : jsBundles.push(item.publicPath) );
           
```
5. 最后把cssBundles在页面输出
``` js
  `${cssBundles.map(item => `<link rel="stylesheet" href="${item}" type="text/css" />`)}`
```






