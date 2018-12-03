import Loadable from 'react-loadable';
import Loading from 'components/loading';
import combineComponent from 'utils/combine-component'
export default function(store) {
  return {
    path: 'post/:slug',
    component: Loadable({
      loader: combineComponent(() =>import('./containers/post-page'), () => import('./reducer'), store, 'currentPost'),
      loading: Loading,
    })
  };
}
