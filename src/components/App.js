import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import Nav from './Nav';
import s from './App.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
const App = ({ children }) => {
  return (
    <div className={s.root}>
        <Helmet
          title="React Isomorphic Skeleton"
          titleTemplate="%s - React Isomorphic Skeleton"
        />
        <h1 className={s.title}>
          React-Isomorphic-Skeleton
        </h1>
        <Nav/>
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
};



export default withStyles(s)(App);
