export default function(store){
  return {
    path: 'post/:slug',
    async getComponents(location, cb) {
      const c =  await import('./containers/PostPage');
      const post = await import('./reducer');
      store.injectAsyncReducer('currentPost', post.default);
      return c.default;
    }
  };
}
