// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import FileUpload from './components/fileUpload';

import './index.styles.pcss';

export default class Index extends Component<*> {
  render(): Node {
    return (
      <div>
        <FileUpload />
      </div>
    );
  }
}
