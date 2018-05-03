import React from 'react';

import FileUpload from './components/fileUpload';

import './demo.styles.pcss';

class Demo extends React.Component {
  render() {
    return (
      <main styleName="demo-page">
        <section styleName="demo-page__caption">
          <div styleName="caption__text">
            <span styleName="caption__subtitle">Uploading Demo</span>
          </div>
        </section>
        <FileUpload />
      </main>
    );
  }
}

export default Demo;
