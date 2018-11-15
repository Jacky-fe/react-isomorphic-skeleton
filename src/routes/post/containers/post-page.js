import { provideHooks } from 'redial';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadPost } from '../actions';
import { Type } from '../../../style';
import Helmet from 'react-helmet';
import NotFound from '../../../components/not-found';
import styles from './style.css'
import withStyles from 'isomorphic-style-loader/lib/withStyles';

const redial = {
  fetch: ({ dispatch, params: { slug } }) => dispatch(loadPost(slug)),
};

const mapStateToProps = state => ({
  title: state.currentPost.data.title,
  content: state.currentPost.data.content,
  isLoading: state.currentPost.isLoading,
  error: state.currentPost.error
});

@withStyles(styles)
@connect(mapStateToProps)
@provideHooks(redial)
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
