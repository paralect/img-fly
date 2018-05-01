import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { apiClient } from 'helpers/api';

import './fileUpload.styles.pcss';

class FileUplaod extends Component {
  state = {
    originalUrl: 'Upload any image file..',
    transformUrl: '',
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length > 0) {
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
        });
      });
  }

  render() {
    return (
      <div>
        <Dropzone styleName="dropzone" onDrop={files => this.onDrop(files)}>
          <div>Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>
        <div>
          <h3>Uploaded file url</h3>
          {this.state.transformUrl ?
            <div>
              <span><b>Original file url: </b> <a href={this.state.originalUrl} target="_blank">{this.state.originalUrl}</a></span> <br />
              <span><b>Sample on the fly transformation url</b>: <a href={this.state.transformUrl} target="_blank">{this.state.transformUrl}</a></span> <br />
              <span><b>Tip:</b> copy/paste resize transformation url and try chaning values</span>
            </div> :
            <span>
              Upload any image file..
            </span>
          }
        </div>
      </div>
    );
  }
}

export default FileUplaod;
