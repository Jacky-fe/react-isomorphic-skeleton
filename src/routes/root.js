import App from '../components/App';
import PostList from './PostList';
import About from './About';
import Post from './Post';
import NotFound from './NotFound';

function createRoutes(store) {
  const root = {
    path: '/',
    component: App,
    childRoutes: [
      About,
      Post(store),
      NotFound
    ],
    indexRoute: {
      component: PostList,
    },
  };

  return root;
}
export default createRoutes;
