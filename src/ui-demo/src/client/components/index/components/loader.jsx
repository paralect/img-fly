import React from 'react';

import './loader.styles.pcss';

class Loader extends React.Component {
  render() {
    return (
      <div styleName="spinner">
        <div styleName="bounce1" />
        <div styleName="bounce2" />
        <div styleName="bounce3" />
      </div>
    );
  }
}

export default Loader;
