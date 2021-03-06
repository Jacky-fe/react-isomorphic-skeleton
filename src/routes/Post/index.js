import Loadable from 'react-loadable';
import Loading from 'components/loading';
import combineComponent from 'utils/combine-component'
export default function(store) {
  return {
    path: 'post/:slug',
    component: Loadable({
      // 将异步的组件和reducer分别进行绑定后再返回组件
      loader: combineComponent(
        () => import('./containers/post-page'),
        () => import('./reducer'), 
        store,
        'currentPost'
      ),
      loading: Loading,
    }),
  };
}