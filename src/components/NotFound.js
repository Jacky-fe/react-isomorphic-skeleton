import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Type } from '../style';

const NotFound = () =>
  <div>
    <Helmet title="Not Found" />

    <h1>Page Not Found!</h1>
  </div>;

export default NotFound;
