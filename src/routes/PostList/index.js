import { provideHooks } from 'redial';
import React from 'react';
import PropTypes from 'prop-types';
import { loadPosts } from './actions';
import { connect } from 'react-redux';
import PostListItem from './components/PostListItem';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PostList.css';

const redial = {
  fetch: ({ dispatch }) => dispatch(loadPosts()),
};

const mapStateToProps = (state) => ({
  posts: state.posts.data,
});

const PostListPage = ({ posts }) =>
  <div className={s.root}>
    {posts.map((post, i) => <PostListItem key={post.id} post={post} />)}
  </div>;

PostListPage.propTypes = {
  posts: PropTypes.array.isRequired,
};



export default provideHooks(redial)(connect(mapStateToProps)(withStyles(s)(PostListPage)));
