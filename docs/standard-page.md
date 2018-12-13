[起步](./startup.md)
## 创建一个标准的按需加载+服务端渲染+数据预取的React+Redux页面
以post路由为例
1. 创建actions和reducer

src/constants.js 增加常量
``` js
export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';
```
src/routes/post/actions.js
``` js
import {
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  LOAD_POST_FAILURE,
} from '../../constants';
import http from 'utils/http-client';

export function loadPost(slug) {
  return {
    // 异步请求使用三态actions，call-api-middleware.js会自动处理
    types: [LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE],
    callAPI: () => { 
      return http.get(`/api/v0/post/${slug}`); 
    },
    payload: { slug },
  };
}

```
src/routes/post/reducer.js
``` js
import * as types from '../../constants';
import update from 'immutability-helper';

export default function (state = {
  lastFetched: null,
  isLoading: false,
  error: null,
  data: {},
}, action) {
  switch (action.type) {
    case types.LOAD_POST_REQUEST:
      return update(state, {
        isLoading: { $set: true },
        error: { $set: null }
      });
    case types.LOAD_POST_SUCCESS:
      return update(state, {
        data: { $set: action.body },
        lastFetched: { $set: action.lastFetched },
        isLoading: { $set: false },
      });
    case types.LOAD_POST_FAILURE:
      return update(state, {
        error: { $set: action.error },
      });
    default:
      return state;
  }
}
```
2. 创建页面文件

src/routes/post/containers/post-page.js
``` js
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { provideHooks } from 'redial';
import NotFound from 'components/not-found';
import styles from './style.css'
import { loadPost } from '../actions';
const redial = {
  fetch: ({ dispatch, params: { slug } }) => dispatch(loadPost(slug)),
};
const mapStateToProps = state => ({
  title: state.currentPost.data.title,
  content: state.currentPost.data.content,
  isLoading: state.currentPost.isLoading,
  error: state.currentPost.error,
});
@provideHooks(redial)
@connect(mapStateToProps)
class PostPage extends React.Component {
  render() {
    const { title, content, isLoading, error } = this.props;
    if (!error) {
      return (
        <div>
          <Helmet
            title={ title }
          />
          {isLoading &&
            <div>
              <h2 className={styles.title}>Loading....</h2>
              <p className={styles.primary} />
            </div>
          }
          {!isLoading &&
            <div>
              <h2 className={styles.title}>{ title }</h2>
              <p className={styles.body}>{ content }</p>
            </div>
          }
        </div>
      );
    } else {
      return <NotFound />;
    }
  }
}

PostPage.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
}

export default PostPage;
```
src/routes/post/containers/style.css
``` css
.body {
  font-size: 1.25rem;
  line-height: 1.5;
  color: #bbb;
  margin: 1rem 0;
}
.title {
  font-size: 36px;
  margin: 1rem 0;
  color: #666;
}
```
3. 创建路由文件

src/routes/post/index.js
``` js
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
```
4. 在路由根文件注册该页面

/src/routes/root.js
``` js
import App from '../components/App';
import PostList from './post-list/containers';
import About from './about';
// 这是刚才写的post路由
import Post from './post';
import NotFound from './not-found';

function createRoutes(store) {
  const root = {
    path: '/',
    component: App,
    childRoutes: [
      About,
      // 这是刚才写的post路由
      Post(store),
      NotFound,
    ],
    indexRoute: {
      component: PostList,
    },
  };
  return root;
}
export default createRoutes;

```

