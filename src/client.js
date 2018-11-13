import { trigger } from 'redial';

import React from 'react';
import { match, Router, browserHistory } from 'react-router';
import matchRoutes from 'react-router/lib/matchRoutes';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from './store';
import { syncRoutes } from './utils/SyncRoutes';
import Wrapper from './components/Wrapper';
const initialState = window.INITIAL_STATE || {};

// Set up Redux (note: this API requires redux@>=3.1.0):
const store = configureStore(initialState);
const { dispatch } = store;

const { pathname, search, hash } = window.location
const location = `${pathname}${search}${hash}`
const allStyles = [];
const insertCss = (...styles) => {
  styles.forEach(item => {
    if (allStyles.indexOf(item) < 0) {
      allStyles.push(item);
      item._insertCss();
    }
  });
};
const context = {insertCss};
const routes = require('./routes/root').default(store);
const render = () => {
  match({ routes, location }, async (error, redirectLocation, renderProps) => {
    // 在初次渲染之前，必须把相关路由的js请求下来，否则会报“div not in div”的错
    await Promise.all(syncRoutes(renderProps.routes, store, true));
    ReactDOM.hydrate(
      <Wrapper context={context}>
        <Provider store={store}>
            <Router routes={routes} history={browserHistory} />
        </Provider>
      </Wrapper>,
      document.getElementById('root')
    );
  });
};

browserHistory.listenBefore(location => {
  // Match routes based on location object:
  match({ routes, location }, async (error, redirectLocation, renderProps) => {
    // Get array of route handler components:
    const { components, routes: sourceRoutes } = renderProps;
    // Define locals to be provided to all lifecycle hooks:
    const locals = {
        path: renderProps.location.pathname,
        query: renderProps.location.query,
        params: renderProps.params,

        // Allow lifecycle hooks to dispatch Redux actions:
        dispatch,
      };

    if (window.INITIAL_STATE) {
      delete window.INITIAL_STATE;
    }
    trigger('fetch', components, locals);
  });
});

if (module.hot) {
  module.hot.accept('./routes/root', () => {
    setTimeout(render);
  });
}

render();
