import Loadable from 'react-loadable';
import Loading from 'components/loading';

export default function(store){
  return {
    path: 'post/:slug',
    component: Loadable({
      loader: async () => {
        const [component, reducer] = await Promise.all([import('./containers/post-page'), import('./reducer')]);
        store.injectAsyncReducer('currentPost', reducer.default);
        return component;
      },
      loading: Loading,
    })
  };
}
