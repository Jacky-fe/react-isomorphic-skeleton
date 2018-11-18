import { provideHooks } from 'redial';
import React from 'react';
import PropTypes from 'prop-types';
import { loadPosts } from '../actions';
import { connect } from 'react-redux';
import PostListItem from '../components/post-list-item';
import s from './post-list.css';
const redial = {
  fetch: ({ dispatch }) => dispatch(loadPosts()),
};

const mapStateToProps = (state) => ({
  posts: state.posts.data,
});

@provideHooks(redial)
@connect(mapStateToProps)
class PostListPage extends React.Component {
  render() {
    const { posts } = this.props;
    return <div className={s.root}>
    {posts.map((post, i) => <PostListItem key={post.id} post={post} />)}
  </div>;
  }
}

PostListPage.propTypes = {
  posts: PropTypes.array,
};

export default PostListPage;
