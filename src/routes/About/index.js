import Loadable from 'react-loadable';
import Loading from 'components/loading';

export default {
  path: 'about',
  component: Loadable({
    loader: () => import('./components/about'),
    loading: Loading,
  })
};
