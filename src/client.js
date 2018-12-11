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

// Set up Redux (note: this API requires redux@>=3.1.0):
const store = configureStore(initialState);
const { dispatch } = store;
const routes = require('./routes/root').default(store);
// 热更新，为了避免router和store报不能修改的错，只能这样触发重新渲染了
const renderKey = window.RENDERKEY || 0;
const render = () => {
  match({ routes, location }, async (error, redirectLocation, renderProps) => {
  error && console.error(error);
  // 在初次渲染之前，必须把相关路由的js请求下来，否则会报“div not in div”的错
  await ConvertLoadableComponents(renderProps.components);
  ReactDOM.hydrate(<Provider key={renderKey} store={store}>
        <Router routes={routes} history={browserHistory} />
      </Provider>,
      document.getElementById('root')
    );
  });
};

browserHistory.listenBefore(location => {
  // Match routes based on location object:
  match({ routes, location }, async (error, redirectLocation, renderProps) => {
  error && console.error(error);
    // Get array of route handler components:
    const { components } = renderProps;
    const locals = {
        path: renderProps.location.pathname,
        query: renderProps.location.query,
        params: renderProps.params,
        // Allow lifecycle hooks to dispatch Redux actions:
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
