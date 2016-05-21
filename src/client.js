import { trigger } from 'redial';

import React from 'react'
import { match, Router, browserHistory } from 'react-router'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import { configureStore } from './store';
import { StyleSheet } from 'aphrodite';
import Wrapper from './components/Wrapper'
const initialState = window.INITIAL_STATE || {};

// Set up Redux (note: this API requires redux@>=3.1.0):
const store = configureStore(initialState);
const { dispatch } = store;

const { pathname, search, hash } = window.location
const location = `${pathname}${search}${hash}`
StyleSheet.rehydrate(window.renderedClassNames);
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
let render = () => {
  const createRoutes = require('./routes/root').default;
  const routes = createRoutes(store);
  // calling `match` is simply for side effects of
  // loading route/component code for the initial location
  match({ routes, location }, () => {
    ReactDOM.render(
      <Wrapper context={context}>
        <Provider store={store}>
            <Router routes={routes} history={browserHistory} key={Math.random()}/>
        </Provider>
      </Wrapper>,
      document.getElementById('root')
    )
  });

  browserHistory.listen(location => {
      // Match routes based on location object:
      match({ routes, location }, (error, redirectLocation, renderProps) => {
        // Get array of route handler components:
        const { components } = renderProps;

        // Define locals to be provided to all lifecycle hooks:
        const locals = {
            path: renderProps.location.pathname,
            query: renderProps.location.query,
            params: renderProps.params,

            // Allow lifecycle hooks to dispatch Redux actions:
            dispatch,
          };

        // Don't fetch data for initial route, server has already done the work:
        if (window.INITIAL_STATE) {
          // Delete initial data so that subsequent data fetches can occur:
          delete window.INITIAL_STATE;
        } else {
          // Fetch mandatory data dependencies for 2nd route change onwards:
          trigger('fetch', components, locals);
        }

        // Fetch deferred, client-only data dependencies:
        trigger('defer', components, locals);
      });
  });
};

if (module.hot) {
  module.hot.accept('./routes/root', () => {
    setTimeout(render);
  });
}

render();
var serverSideStyle = document.getElementById("server-side-style");
if(serverSideStyle) {
	document.getElementsByTagName("head")[0].removeChild(serverSideStyle);
}
