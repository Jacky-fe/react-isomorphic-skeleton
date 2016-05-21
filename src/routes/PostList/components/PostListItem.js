import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PostListItem.css';


const PostListItem = ({ post }) =>
  <div className={s.root}>
    <h3><Link to={`/post/${post.slug}`} className={s.title}>{post.title}</Link></h3>
  </div>;



export default withStyles(s)(PostListItem);
