import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { callAPIMiddleware } from './middleware/callAPIMiddleware';
import { DEFAULT_REDUCER_KEYS, default as createReducer } from './createReducer';

export function configureStore(initialState = {}) {
  const emptyReducer = (state = {}) => state;
  const initialReducers = {};
  for(const key in initialState) {
    if (DEFAULT_REDUCER_KEYS.indexOf(key) < 0) {
      // 注入空reducer，以免报“Unexpected key "currentPost" found in previous state”
      initialReducers[key] = emptyReducer;
    }
  }
  let store = createStore(createReducer(initialReducers), initialState, compose(
    applyMiddleware(
      thunk,
      callAPIMiddleware
    ),
     (process.env.NODE_ENV === 'development') &&
      typeof window === 'object' &&
       typeof window.devToolsExtension !== 'undefined' ?
        window.devToolsExtension() : f => f
  ));

  store.asyncReducers = initialReducers;

  store.injectAsyncReducer = (name, asyncReducer) => {
    if (!store.asyncReducers[name]) {
      store.asyncReducers[name] = asyncReducer;
      store.replaceReducer(createReducer(store.asyncReducers));
    }
  };
  
  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      module.hot.accept('./createReducer', () =>
        store.replaceReducer(require('./createReducer').default)
      );
    }
  }

  return store;
}
