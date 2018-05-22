export default {
  path: 'post/:slug',
  getComponents(location, cb) {
    import(/* webpackPrefetch: true */'./containers/PostPage').then(postPage => {
      cb(null, postPage.default)
    });
  },
};
