// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import FileUpload from './components/fileUpload';
import TransformationExamples from './components/transformationExamples';

import './index.styles.pcss';

export default class Index extends Component<*> {
  render(): Node {
    return (
      <main styleName="demo-page">
        <section styleName="demo-page__caption">
          <div styleName="caption__text">
            <span styleName="caption__title">Img Fly</span>
            <span styleName="caption__subtitle">Upload and transform your images on the fly</span>
          </div>
        </section>
        <FileUpload />
        <TransformationExamples />
      </main>
    );
  }
}
