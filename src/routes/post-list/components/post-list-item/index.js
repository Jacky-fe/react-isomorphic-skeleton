import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import s from './index.css';

const PostListItem = ({ post }) =>
  <div className={s.root}>
    <h3><Link to={`/post/${post.slug}`} className={s.title}>{post.title}</Link></h3>
  </div>;

export default PostListItem;
