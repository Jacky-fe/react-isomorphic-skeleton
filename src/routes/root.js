import App from '../components/App';
import PostList from './PostList';
import About from './About';
import Post from './Post';
import NotFound from './NotFound';
import(/* webpackPrefetch: true */'./Post/containers/PostPage');

function createRoutes() {
  const root = {
    path: '/',
    component: App,
    getChildRoutes(location, cb) {
      cb(null, [
        About,
        Post,
        NotFound,
      ])
    },

    indexRoute: {
      component: PostList,
    },
  };

  return root;
}
const routes = createRoutes();
export default routes;
