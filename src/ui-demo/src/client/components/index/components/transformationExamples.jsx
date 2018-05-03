import React, { Component } from 'react';

import './transformationExamples.styles.pcss';

class TransformationExamples extends Component {
  state = {
    showFullImage: false,
  }

  onPreviewImageClick = (image, size) => {
    this.setState({
      ...this.state,
      showFullImage: true,
      fullImageName: image,
      fullImageSize: size,
    });
  }

  onImagePreviewClose = () => {
    this.setState({
      showFullImage: false,
    });
  }

  onImagePreviewOverlayClick = (event) => {
    if (this.modal) {
      if (!this.modal.contains(event.target)) {
        this.setState({
          showFullImage: false,
        });
      }
    }
  }

  render() {
    const { showFullImage, fullImageName, fullImageSize } = this.state;

    return (
      <main styleName="demo-page">
        <section>
          <article styleName="demo-page__card">
            <header styleName="card__header">
              <p styleName="card__title">Image preview</p>
              <p styleName="card__subtitle">
                Resize your image and reduce its quality for preview.
                The loss of visual quality is barely noticeable to the human eye,
                but the size of the image is considerably less.
                This transformation can be used for creating galleries or lists of images.
                Once you click on the image, picture with a real size and good quality is shown.
              </p>
            </header>
            <div styleName="card__images-container">
              <div styleName="card__preview-image" onClick={() => this.onPreviewImageClick('picture1', '72.3')} role="presentation">
                <img styleName="card__image" src={require('static/images/smallPicture1.jpg')} alt="" />
                <div styleName="preview-image__text">
                  Size: 12.3 KB
                </div>
              </div>
              <div styleName="card__preview-image" onClick={() => this.onPreviewImageClick('picture2', '143')} role="presentation">
                <img styleName="card__image" src={require('static/images/smallPicture2.jpg')} alt="" />
                <div styleName="preview-image__text">
                  Size: 16.5 KB
                </div>
              </div>
              <div styleName="card__preview-image" onClick={() => this.onPreviewImageClick('picture3', '138')} role="presentation">
                <img styleName="card__image" src={require('static/images/smallPicture3.jpg')} alt="" />
                <div styleName="preview-image__text">
                  Size: 21.2 KB
                </div>
              </div>
            </div>
            <div styleName="card__footer">
              http://localhost:4001/5aead034234858002e75c1a8/resize-width_330,height_330+crop-gravity_center+toFormat-jpeg,quality_50/picture1.jpg
            </div>
          </article>

          <article styleName="demo-page__card">
            <header styleName="card__header">
              <p styleName="card__title">Avatar uploading with face detection</p>
              <p styleName="card__subtitle">
                Your application may support avatar uploading or displaying
                profile pictures from different social networks.
                With face detection transformation you can easily manipulate user
                photos so they will perfectly fit into the design of your web or
                mobile application.
              </p>
            </header>
            <div styleName="card__images-container card__images-container--arrow card__images-container--avatar-arrow">
              <div styleName="card__photo-avatar-container">
                <img styleName="card__image" src={require('static/images/photoForAvatar.jpg')} alt="" />
              </div>
              <div styleName="card__avatar-container">
                <img styleName="card__image" src={require('static/images/avatar.jpg')} alt="" />
              </div>
            </div>
            <div styleName="card__footer">
              http://localhost:4001/5aead00a234858002e75c1a5/resize-width_300,height_300+max+crop-strategy_attention/photoForAvatar.jpg
            </div>
          </article>

          <article styleName="demo-page__card">
            <header styleName="card__header">
              <p styleName="card__title">Low quality image preview</p>
              <p styleName="card__subtitle">
                While your big and beautiful image with a great quality is loading,
                user do not want to see an empty screen. With this transformation you
                can first display a small blurry image, and then load a large one.
              </p>
            </header>
            <div styleName="card__images-container card__images-container--arrow card__images-container--blur-arrow">
              <div styleName="card__before-blur-container">
                <img styleName="card__image" src={require('static/images/beforeBlur.jpg')} alt="" />
              </div>
              <div styleName="card__blur-container">
                <img styleName="card__image" src={require('static/images/blur.jpg')} alt="" />
              </div>
            </div>
            <div styleName="card__footer">
              http://localhost:4001/5aeacfc5234858002e75c1a2/resize-width_400,height_1080+max+toformat-jpeg,quality_50+blur-sigma_20/beforeBlur.jpg
            </div>
          </article>

          <article styleName="demo-page__card">
            <header styleName="card__header">
              <p styleName="card__title">Image effects and filters</p>
              <p styleName="card__subtitle">
                Img Fly allows to apply different effects to change visual
                appearance of uploaded pictures. For example, you can transform
                an image to grayscale.
              </p>
            </header>
            <div styleName="card__images-container card__images-container--arrow">
              <div styleName="card__image-container">
                <img styleName="card__image" src={require('static/images/beforeGrayscale.jpg')} alt="" />
              </div>
              <div styleName="card__image-container">
                <img styleName="card__image" src={require('static/images/grayscale.jpg')} alt="" />
              </div>
            </div>
            <div styleName="card__footer">
              http://localhost:4001/5aeacf51234858002e75c19f/resize-width_500,height_1080+max+toformat-jpeg+grayscale/beforeGrayscale.jpg
            </div>
          </article>

          {showFullImage &&
            <div styleName="modal__overlay" onClick={this.onImagePreviewOverlayClick} role="presentation">
              <button styleName="modal__close" onClick={this.onImagePreviewClose}>Close</button>
              <div styleName="modal" ref={(node) => { this.modal = node; }}>
                <article styleName="modal__content">
                  <div>
                    <img styleName="modal__image" alt="" src={require(`static/images/${fullImageName}.jpg`)} />
                  </div>
                  <div styleName="modal__footer">Size of the image is {fullImageSize} KB</div>
                </article>
              </div>
            </div>
          }

        </section>
      </main>
    );
  }
}

export default TransformationExamples;
