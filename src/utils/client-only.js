import React from 'react';
export function clientOnlyComponent(ComposedComponent) {
  return class ClientOnlyComponent extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = { isClient: false }
    }
    componentDidMount() {
      // 为什么这么实现，是为了避免ssr之后报服务端渲染结果和客户端不一致的问题
      this.setState({ isClient: true })
    }
    render() {
      const { isClient } = this.state;
      return isClient ? <ComposedComponent {...this.props} /> : null;
    }
  };
};
export default function() {
  return ComposedComponent => clientOnlyComponent(ComposedComponent);
};
