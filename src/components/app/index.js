import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Nav from '../nav';
import s from './index.scss';
import { message } from 'antd';
class App extends React.Component {
  static propTypes = {
    children: PropTypes.element,
  }
  info = (e) => {
    message.info('yes, it\'s me!');
  }
  render() {
    const { children } = this.props;
    return (
      <div className={s.root}>
        <Helmet
          title="React Isomorphic Skeleton"
          titleTemplate="%s - React Isomorphic Skeleton"
        />
        <h1 className={s.title} >
          React-Isomorphic-Skeleton
          </h1>
        <a onClick={this.info}>click here will open a antd message control</a>
        <Nav />
        {children}
        <footer className={s.footer}>
          Copyright © 2016 <a className={s.footerLink}
            href="https://www.facebook.com/kai.zhang.1840070"
            target="_blank">
            Kai Zhang
          </a>
        </footer>
      </div>
    );
  }
}

export default App;
