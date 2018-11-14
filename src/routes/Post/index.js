export default function(store){
  return {
    path: 'post/:slug',
    async getComponents(location, cb) {
      const [component, reducer] = await Promise.all([import('./containers/PostPage'), import('./reducer')]);
      store.injectAsyncReducer('currentPost', reducer.default);
      return component.default;
    }
  };
}
