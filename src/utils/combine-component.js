export default function (componentRequest, reducerRequest, store, stateKey) {
  return async () => {
    const [component, reducer] = await Promise.all([componentRequest(), reducerRequest()]);
    store.injectAsyncReducer(stateKey, reducer.default);
    return component;
  }
}