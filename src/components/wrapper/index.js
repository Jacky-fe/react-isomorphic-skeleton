import React from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import PropTypes from 'prop-types';

class Wrapper extends React.Component {

  static propTypes = {
    context: PropTypes.shape({
      insertCss: PropTypes.func,
    }),
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  static childContextTypes = {
    insertCss: PropTypes.func.isRequired,
  };

  getChildContext() {
    const context = this.props.context;
    return {
      insertCss: context.insertCss || emptyFunction,
    };
  }

  render() {
    return this.props.children;
  }
}

export default Wrapper;
