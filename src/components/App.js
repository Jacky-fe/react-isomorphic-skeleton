import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import Nav from './Nav';
import { StyleSheet, css } from 'aphrodite';
import { Type } from '../style';

const App = ({ children }) => {
  return (
    <div className={css(styles.root)}>
        <Helmet
          title="React Isomorphic Skeleton"
          titleTemplate="%s - React Isomorphic Skeleton"
        />
        <h1 className={css(styles.title)}>
          React
          Isomorphic
          Skeleton
        </h1>
        <Nav/>
      {children}
      <footer className={css(styles.footer)}>
        Copyright © 2016 <a className={css(styles.footerLink)}
          href="https://www.facebook.com/kai.zhang.1840070"
          target="_blank">
          Kai Zhang
        </a>
        </footer>
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    maxWidth: 700,
    color: '#000',
    margin: '2rem auto',
  },
  title: {
    color: '#000',
    maxWidth: 300,
    fontSize: 56,
  },
  footer: {
    margin: '4rem auto',
    textAlign: 'center',
    color: '#b7b7b7',
  },
  footerLink: {
    display: 'inline-block',
    color: '#000',
    textDecoration: 'none',
  },
});

export default App;
