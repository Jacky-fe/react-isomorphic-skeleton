[React SSR原理](./principle.md)
# 服务端数据预取 & 服务端渲染
刚才说了服务端渲染原理，renderToXXX是一次性操作，所以我们需要在调用renderToXXX之前取到数据并传递给组件。

## 常见方案
通常业内有几种解决方案：
1. 跟路由挂钩，例如：
``` js
[{
  path: '/post',
  prefetch: async () => {
    return await request('/api/posts)
  }
}]
```
2. 和组件挂钩，例如[afterjs](https://github.com/jaredpalmer/razzle/tree/master/examples/with-afterjs/)以及本模版的方案

与组件挂钩的好处在于，可以解耦和url的逻辑，同时在一层层的路由时，可以更好的处理数据预取

例如：

/user/datacenter/income这种三层路由

* 我们可以在“/user”路由关联的组件上预取user信息

* 在“/datacenter”路由关联的组件上预取，收入，支出等汇总信息

* 在"/income"路由获取近一个月的收入信息

**本模版是一个传统的React + Redux + React-Router的架构，所以最终我们将服务端预取的数据放在了state里**

## 如何实现数据预取

1. 编写actions和reducer

actions.js
``` js
import {
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  LOAD_POST_FAILURE,
} from '../../constants';
import http from 'utils/http-client';

export function loadPost(slug) {
  return {
    // 我们写了一个middleware，用于处理这种需要异步的action，详情请见src/middleware/call-api-middleware.js
    // 请求开始，成功，失败
    types: [LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE],

    // 执行数据预取
    callAPI: () => { 
      return http.get(`/api/v0/post/${slug}`); 
    },

    // action的payload
    payload: { slug },
  };
}
```
reducer.js
``` js
import * as types from '../../constants';
import update from 'immutability-helper';

export default function (state = {
  lastFetched: null,
  isLoading: false,
  error: null,
  data: {},
}, action) {
  switch (action.type) {
    case types.LOAD_POST_REQUEST:
      return update(state, {
        isLoading: { $set: true },
        error: { $set: null }
      });
    case types.LOAD_POST_SUCCESS:
      return update(state, {
        data: { $set: action.body },
        lastFetched: { $set: action.lastFetched },
        isLoading: { $set: false },
      });
    case types.LOAD_POST_FAILURE:
      return update(state, {
        error: { $set: action.error },
      });
    default:
      return state;
  }
}

```
2. 在组件上通过redial挂载一个钩子，调用刚才action里的loadPost，注意@provideHooks(redial)最好是最后一个装饰器，避免被其他HOC的装饰器包起来了
``` js
import { provideHooks } from 'redial';
import { loadPost } from '../actions';
// 调用actions
const redial = {
  fetch: ({ dispatch, params: { slug } }) => dispatch(loadPost(slug)),
};

@provideHooks(redial)
@connect(mapStateToProps)
class PostPage extends React.Component {
  render() {
     // ... 
  }
}
```
3. 在路由里绑定组件和reducer
``` js
import Loadable from 'react-loadable';
import Loading from 'components/loading';
import combineComponent from 'utils/combine-component'
export default function(store) {
  return {
    path: 'post/:slug',
    component: Loadable({
      // 将异步的组件和reducer分别进行绑定后再返回组件
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
## 其他实现细节，了解即可，代码不用改动
1. 通过react-router3的match方法，拿到对应的组件；
``` js
// 注意，这里将一些无关的代码做了删减，具体可以阅读src/server.js的源码
import { createMemoryHistory, RouterContext, match } from 'react-router';
const store = configureStore();
const routes = createRoutes(store);
match({ routes, history }, async (error, redirectLocation, renderProps) => {
  const { components } = renderProps;
});
```
2. 数据预取：由于使用React-Loadable做了代码切割，所以需要把这些组件取出来再进行预取；
``` js
// 注意，这里将一些无关的代码做了删减，具体可以阅读src/server.js的源码
import { trigger } from 'redial';
import ConvertLoadableComponents from 'utils/convert-loadable-components'
  // Define locals to be provided to all lifecycle hooks:
  const { dispatch } = store;
  const locals = {
    path: renderProps.location.pathname,
    query: renderProps.location.query,
    params: renderProps.params,
    // Allow lifecycle hooks to dispatch Redux actions:
    dispatch,
  };
  const preloadCompoents = await ConvertLoadableComponents(components);
  trigger('fetch', preloadCompoents, locals);
```
3. 将预取后的数据放到window.INITIAL_STATE里，客户端通过它构造store并渲染
``` js
// 注意，这里将一些无关的代码做了删减，具体可以阅读src/server.js的源码
const initialState = store.getState();
 const InitialView = (<Loadable.Capture report={moduleName => modules.push(moduleName)}>
    <Provider store={store}>
      <RouterContext {...renderProps} />
    </Provider>
  </Loadable.Capture>);
const data = ReactDom.renderToString(InitialView);
 const outputhtml = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
      <div id="root" className="container-fluid">${data}</div>
      <script>
      window.INITIAL_STATE = ${JSON.stringify(initialState)};
      </script>
    </body>
  </html>
  `
```
4. 客户端渲染，React会通过rehyrate验证服务端的代码
``` js
// 部分低端浏览器没有map和set
import 'core-js/es6/map';
import 'core-js/es6/set';
import { trigger } from 'redial';
import React from 'react';
import { match, Router, browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ConvertLoadableComponents from 'utils/convert-loadable-components';
import { configureStore } from './store';
// 通过服务端返回的INITIAL_STATE构造store
const initialState = window.INITIAL_STATE || {};
const store = configureStore(initialState);
const { dispatch } = store;
const routes = require('./routes/root').default(store);
// 热更新需要，为了避免router和store报不能修改的错，只能这样触发重新渲染了
const renderKey = window.RENDERKEY || 0;
const render = () => {
  match({ routes, location }, async (error, redirectLocation, renderProps) => {
  error && console.error(error);
  // 在初次渲染之前，必须把相关路由的js请求下来，否则会和服务端渲染的不一样的错“div not in div”的错
  await ConvertLoadableComponents(renderProps.components);
  ReactDOM.hydrate(<Provider key={renderKey} store={store}>
        <Router routes={routes} history={browserHistory} />
      </Provider>,
      document.getElementById('root')
    );
  });
};

browserHistory.listenBefore(location => {
  // 和服务端逻辑一样，当改变路由的时候预取数据
  match({ routes, location }, async (error, redirectLocation, renderProps) => {
  error && console.error(error);
    const { components } = renderProps;
    const locals = {
        path: renderProps.location.pathname,
        query: renderProps.location.query,
        params: renderProps.params,
        dispatch,
      };
    // 转化loadable组件，为了取到里面的钩子
    const preloadCompoents = await ConvertLoadableComponents(components);
    trigger('fetch', preloadCompoents, locals);
  });
});

if (module.hot) {
  // 为了使热更新生效，必须改ROUTERKEY引起路由的重新渲染
  window.RENDERKEY = renderKey + 1;
  module.hot.accept();
}
render();

```
[代码切割](./code-split.md)