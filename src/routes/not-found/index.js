import Loadable from 'react-loadable';
import Loading from '../../components/loading';

export default {
  path: '*',
  component: Loadable({
    loader: () => import('components/not-found'),
    loading: Loading
  })
};
