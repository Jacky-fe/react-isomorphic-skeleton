import Loadable from 'react-loadable';
import Loading from 'components/loading';

export default {
  path: 'about',
  component: Loadable({
    loader: () => import('./containers/about'),
    loading: Loading,
  }),
};
