import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { apiClient } from 'helpers/api';

import Loader from './loader';

import './fileUpload.styles.pcss';

class FileUplaod extends Component {
  state = {
    originalUrl: 'Upload any image file..',
    transformUrl: '',
    loading: false,
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length > 0) {
      this.setState({
        ...this.state,
        loading: true,
      });
      this.uploadFile(acceptedFiles[0]);
    }
  }

  uploadFile = (file) => {
    const data = new FormData();
    data.append('file', file);
    apiClient.post('/upload', data)
      .then((res) => {
        const originalUrl = res.files[0].url;
        const originalName = res.files[0].name;
        const baseTransformUrl = originalUrl.replace(originalName, '');

        this.setState({
          originalUrl,
          transformUrl: `${baseTransformUrl}resize-width_1080,height_1080+max/${originalName}`,
          loading: false,
        });
      });
  }

  render() {
    return (
      <section styleName="file-upload">
        <Dropzone styleName="dropzone" onDrop={files => this.onDrop(files)}>
          {this.state.loading
            ? <Loader />
            : <div styleName="dropzone__text">Try dropping some files here, or click to select files to upload.</div>
          }
        </Dropzone>
        <div styleName="file-upload__result">
          <div styleName="file-upload__title">Uploaded file url</div>
          {this.state.transformUrl ?
            <div>
              <div styleName="file-upload__text">
                <span styleName="file-upload__text--bold">Original file url: </span>
                <a href={this.state.originalUrl} target="_blank">{this.state.originalUrl}</a>
              </div>
              <div styleName="file-upload__text">
                <span styleName="file-upload__text--bold">Sample on the fly transformation url: </span>
                <a href={this.state.transformUrl} target="_blank">{this.state.transformUrl}</a>
              </div>
              <div styleName="file-upload__text">
                <span styleName="file-upload__text--bold">Tip: </span>copy/paste resize transformation url and try changing values
              </div>
            </div> :
            <span styleName="file-upload__text">
              Upload any image file..
            </span>
          }
        </div>
      </section>
    );
  }
}

export default FileUplaod;
