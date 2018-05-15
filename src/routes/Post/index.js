if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

export default function createRoutes() {
  return {
    path: 'post/:slug',
    getComponents(location, cb) {
      require.ensure([
          './containers/PostPage',
        ], (require) => {
          let PostPage = require('./containers/PostPage').default;
          cb(null, PostPage);
        });
    },
  };
}
