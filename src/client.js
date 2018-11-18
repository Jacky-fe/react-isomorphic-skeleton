import { trigger } from 'redial';

import React from 'react';
import { match, Router, browserHistory } from 'react-router';
import matchRoutes from 'react-router/lib/matchRoutes';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Loadable from 'react-loadable'
import ConvertLoadableComponents from 'utils/convert-loadable-components'
import { configureStore } from './store';
import Wrapper from './components/wrapper';
const initialState = window.INITIAL_STATE || {};

// Set up Redux (note: this API requires redux@>=3.1.0):
const store = configureStore(initialState);
const { dispatch } = store;

const routes = require('./routes/root').default(store);
const render = () => {
  match({ routes, location }, async (error, redirectLocation, renderProps) => {
    // 在初次渲染之前，必须把相关路由的js请求下来，否则会报“div not in div”的错
    await Loadable.preloadReady();
    await Promise.all(renderProps.components.map(item => item.preload && item.preload()));
    ReactDOM.hydrate(<Provider store={store}>
        <Router routes={routes} history={browserHistory} />
      </Provider>,
      document.getElementById('root')
    );
  });
};

browserHistory.listenBefore(location => {
  // Match routes based on location object:
  match({ routes, location }, async (error, redirectLocation, renderProps) => {
    // Get array of route handler components:
    // Define locals to be provided to all lifecycle hooks:
    const { components } = renderProps;
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
    const preloadCompoents = await ConvertLoadableComponents(components);
    trigger('fetch', preloadCompoents, locals);
  });
});

if (module.hot) {
  module.hot.accept('./routes/root', () => {
    setTimeout(render);
  });
}

render();
