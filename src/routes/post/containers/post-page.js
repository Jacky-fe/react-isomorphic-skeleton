import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { provideHooks } from 'redial';
import NotFound from 'components/not-found';
import styles from './style.css'
import { loadPost } from '../actions';
const redial = {
  fetch: ({ dispatch, params: { slug } }) => dispatch(loadPost(slug))
};
const mapStateToProps = state => ({
  title: state.currentPost.data.title,
  content: state.currentPost.data.content,
  isLoading: state.currentPost.isLoading,
  error: state.currentPost.error
});
@provideHooks(redial)
@connect(mapStateToProps)
class PostPage extends React.Component {
  render() {
    const { title, content, isLoading, error } = this.props;
    if (!error) {
      return (
        <div>
          <Helmet
            title={ title }
          />
          {isLoading &&
            <div>
              <h2 className={styles.title}>Loading....</h2>
              <p className={styles.primary}></p>
            </div>
          }
          {!isLoading &&
            <div>
              <h2 className={styles.title}>{ title }</h2>
              <p className={styles.body}>{ content }</p>
            </div>
          }
        </div>
      );
    } else {
      // maybe check for different types of errors and display appropriately
      return <NotFound />;
    }
  }
}

PostPage.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.object
}

export default PostPage;
