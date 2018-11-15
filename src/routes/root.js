import App from '../components/App';
import PostList from './post-list/containers';
import About from './about';
import Post from './post';
import NotFound from './not-found';

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
