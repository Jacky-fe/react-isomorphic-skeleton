import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { callAPIMiddleware } from './middleware/call-api-middleware';
import { DEFAULT_REDUCER_KEYS, default as createReducer } from './create-reducer';

export function configureStore(initialState = {}) {
  const emptyReducer = (state = {}) => state;
  emptyReducer.isEmpty = true;
  const initialReducers = {};
  for(const key in initialState) {
    if (DEFAULT_REDUCER_KEYS.indexOf(key) < 0) {
      // 注入空reducer，以免报“Unexpected key "xxx" found in previous state”
      initialReducers[key] = emptyReducer;
    }
  }
  let store = createStore(createReducer(initialReducers), initialState, compose(
    applyMiddleware(
      thunk,
      callAPIMiddleware
    )
  ));

  store.asyncReducers = initialReducers;

  store.injectAsyncReducer = function(name, asyncReducer){
    this.asyncReducers[name] = asyncReducer;
    this.replaceReducer(createReducer(this.asyncReducers));
  };
  
  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      module.hot.accept('./create-reducer', () =>
        store.replaceReducer(require('./create-reducer').default)
      );
    }
  }

  return store;
}
