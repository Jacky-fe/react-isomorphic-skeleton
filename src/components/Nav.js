import React from 'react';
import IndexLink from 'react-router/lib/IndexLink';
import PropTypes from 'prop-types';

import Link from 'react-router/lib/Link';
import style from './Nav.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
const Nav = () =>
  <div>
    <IndexLink to="/"
      className={style.link}
      activeClassName={`${style.link} ${style.activeLink}`}>
      Home
    </IndexLink>
    <Link to="/about"
      className={style.link}
      activeClassName={`${style.link} ${style.activeLink}`}>
      About
    </Link>
    <a href="https://github.com/Jacky-fe/react-isomorphic-skeleton" className={style.link} target="_blank">GitHub</a>
    <a href="https://www.facebook.com/kai.zhang.1840070" className={style.link} target="_blank">Facebook</a>
  </div>;

export default withStyles(style)(Nav);
