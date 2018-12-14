import 'core-js/es6/map';
import 'core-js/es6/set';
import { trigger } from 'redial';
import React from 'react';
import { match, Router, browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ConvertLoadableComponents from 'utils/convert-loadable-components';
import { configureStore } from './store';
const initialState = window.INITIAL_STATE || {};

const store = configureStore(initialState);
const { dispatch } = store;
const routes = require('./routes/root').default(store);
// 热更新，为了避免router和store报不能修改的错，只能这样触发重新渲染了
const renderKey = window.RENDERKEY || 0;

const clientPrefetch = async (renderProps, load) => {
  const { components } = renderProps;
  const preloadCompoents = await ConvertLoadableComponents(components);
  if (load) {
    // 为了避免热更新之后多次读取
    const locals = {
      path: renderProps.location.pathname,
      query: renderProps.location.query,
      params: renderProps.params,
      dispatch,
    };
    // 转化loadable组件，为了取到里面的钩子
    trigger('fetch', preloadCompoents, locals);
  }
}

const render = () => {
  window.RENDERKEY = renderKey + 1;
  match({ routes, location }, async (error, redirectLocation, renderProps) => {
  error && console.error(error);
  // 在初次渲染之前，必须把相关路由的js请求下来，否则会报“div not in div”的错
  await clientPrefetch(renderProps, 
    // 初次渲染不用取数据，热更新渲染需要取数据
    module.hot && renderKey > 0
  );
  ReactDOM.hydrate(<Provider key={renderKey} store={store}>
        <Router routes={routes} history={browserHistory} />
      </Provider>,
      document.getElementById('root')
    );
  });
};
// 由于browserHistory监控了全局的HistoryApi，所以无法被释放
browserHistory.listenBefore(location => {
  match({ routes, location }, (error, redirectLocation, renderProps) => {
    error && console.error(error);
    // 由于browserHistory没有释放，会反复调用，所以开发环境只能用renderkey做限制
    clientPrefetch(renderProps, (module.hot && renderKey === window.RENDERKEY - 1) || !module.hot);
  });
});

if (module.hot) {
  // 为了使热更新生效，必须改ROUTERKEY引起路由的重新渲染
  module.hot.accept();
  if (module.hot.status() === 'apply') {
    /* eslint-disable */
    const jsModule = module.__proto__.exports;
    jsModule.mRender();
    console.log(jsModule, jsModule.mRender)
    /* eslint-enable */
  }
}
if (renderKey === 0) {
  render();
}
export function mRender() {
  render();
}
