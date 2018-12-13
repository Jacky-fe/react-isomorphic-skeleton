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
