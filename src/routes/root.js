// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import App from '../components/App';
import PostList from './PostList';
function createRoutes() {
  const root = {
    path: '/',
    component: App,
    getChildRoutes(location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          require('./About').default, // no need to modify store, no reducer
          require('./Post').default, // add async reducer
          require('./NotFound').default
        ]);
      });
    },

    indexRoute: {
      component: PostList,
    },
  };

  return root;
}
const routes = createRoutes();
export default routes;
