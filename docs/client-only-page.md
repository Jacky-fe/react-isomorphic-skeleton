[起步](./startup.md)
## 创建一个纯客户端渲染页面
1 创建页面文件，通过client-only装饰器标注该组件即可
src/routes/about/containers/about.js
``` js
import React from 'react';
import Helmet from 'react-helmet';
import clientOnly from 'utils/client-only';
import styles from './style.css'
import data from '../data';

// clientOnly装饰器，标注后仅在客户端渲染
@clientOnly()
class About extends React.Component {
  render() {
    return (
      <div>
        <Helmet
          title="About"
          />
        <h2 className={styles.header}>About</h2>
        <h3 className={styles.header}>this page is rendering on client by @clientOnly() decorator</h3>
        <p className={styles.lead}>
          This is an example react application skeleton with isomorphic rendering, async react-router routes, async redux reducers, async data fetching, and code-splitting. And you can debug it with browsersync.
        </p>
        <h2 className={styles.header}>Base on</h2>
        <p className={styles.lead}>The code is base on <a className={styles.link} href="https://github.com/jaredpalmer/react-production-starter" target="_blank">React Production Starter</a>The script is base on <a className={styles.link} href="https://github.com/kriasoft/react-starter-kit" target="_blank">React Start Kit</a></p>
        <h2 className={styles.header}>Under the Hood</h2>
        <ul className={styles.list}>
          { data.map((item, i) => <li key={item.link}>
            <h3><a className={styles.link} href={item.link} target="_blank">{item.resource}</a></h3>
            <p className={styles.body}>{item.description}</p>
            </li>) }
        </ul>
      </div>
    );
  }
}
export default About;
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
2. 创建路由文件
src/routes/post/index.js
``` js
import Loadable from 'react-loadable';
import Loading from 'components/loading';

export default {
  path: 'about',
  component: Loadable({
    loader: () => import('./containers/about'),
    loading: Loading,
  }),
};
```
3. 在路由根文件注册该页面
/src/routes/root.js
``` js
import App from '../components/App';
import PostList from './post-list/containers';
// 这是刚才写的About路由
import About from './about';
import Post from './post';
import NotFound from './not-found';

function createRoutes(store) {
  const root = {
    path: '/',
    component: App,
    childRoutes: [
      // 这是刚才写的Aboutt路由
      About,
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