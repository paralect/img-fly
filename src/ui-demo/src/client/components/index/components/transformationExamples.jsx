import React, { Component } from 'react';

import './transformationExamples.styles.pcss';

class TransformationExamples extends Component {
  state = {
  }

  render() {
    return (
      <main styleName="demo-page">
        <section styleName="demo-page__caption">
          <div styleName="caption__text">
            <span styleName="caption__title">Img Fly</span>
            <span styleName="caption__subtitle">Upload and transform your images on the fly</span>
          </div>
        </section>
        <section>
          <article styleName="demo-page__card">
            <header styleName="card__header">
              <p styleName="card__title">Image preview</p>
              <p styleName="card__subtitle">
                Resize your image and reduce its quality for preview. The loss of visual quality is barely noticeable to the human eye, but the size of the image is considerably less.
                This transformation can be used for creating galleries or lists of images. Once you click on the image, picture with a real size and quality is shown.
              </p>
            </header>
            <div styleName="card__images-container">
              <a>
                <div styleName="card__preview-image">
                  <img styleName="card__image" src="http://localhost:4001/5ad9b61564899b001f43cfc1/resize-width_330,height_330+crop-gravity_center+toFormat-jpeg,quality_50/stock-photo-240037471.jpg" alt="" />
                  <div styleName="preview-image__text">
                    Size: 12.3 KB
                  </div>
                </div>
              </a>
              <a>
                <div styleName="card__preview-image">
                  <img styleName="card__image" src="http://localhost:4001/5ad9f20464899b001f43cfdc/resize-width_330,height_330+crop-gravity_center+toFormat-jpeg,quality_50/stock-photo-231256573.jpg" alt="" />
                  <div styleName="preview-image__text">
                    Size: 16.5 KB
                  </div>
                </div>
              </a>
              <a>
                <div styleName="card__preview-image">
                  <img styleName="card__image" src="http://localhost:4001/5ad9f3fb64899b001f43cfe1/resize-height_330,width_330+crop-gravity_center+toFormat-jpeg,quality_50/stock-photo-240478783.jpg" alt="" />
                  <div styleName="preview-image__text">
                    Size: 21.2 KB
                  </div>
                </div>
              </a>
            </div>
            <div styleName="card__footer">
                http://localhost:4001/5ad9b61564899b001f43cfc1/resize-width_330,height_330+crop-gravity_center+toFormat-jpeg,quality_50/stock-photo-240037471.jpg
            </div>
          </article>

          <article styleName="demo-page__card">
            <header styleName="card__header">
              <p styleName="card__title">Avatar uploading with face detection</p>
              <p styleName="card__subtitle">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut metus molestie, sagittis libero vitae, tempor odio.
              </p>
            </header>
            <div styleName="card__images-container card__images-container--arrow">
              <div styleName="card__image-container">
                <img styleName="card__image" src="http://localhost:4001/5ad8914064899b001f43cfb5/stock-photo-242845961.jpg" alt="" />
              </div>
              <div styleName="card__image-container">
                <img styleName="card__image" src="http://localhost:4001/5ad8914064899b001f43cfb5/grayscale/stock-photo-242845961.jpg" alt="" />
              </div>
            </div>
            <div styleName="card__footer">
                http://localhost:3001/5ac0bb5fab7ce4028e879d03/extract-left_0,top_30,width_400,height_300+resize-width_300/nice_file_name.png
            </div>
          </article>

          <article styleName="demo-page__card">
            <header styleName="card__header">
              <p styleName="card__title">Resizing and cropping image</p>
              <p styleName="card__subtitle">
                With resize and crop options you can transform images in order to fit into the design of your web or mobile application.
              </p>
            </header>
            <div styleName="card__images-container card__images-container--arrow">
              <div styleName="card__image-container">
                <img styleName="card__image" src="http://localhost:4001/5ad8914064899b001f43cfb5/stock-photo-242845961.jpg" alt="" />
              </div>
              <div styleName="card__image-container">
                <img styleName="card__image" src="http://localhost:4001/5ad8914064899b001f43cfb5/grayscale/stock-photo-242845961.jpg" alt="" />
              </div>
            </div>
            <div styleName="card__footer">
                http://localhost:3001/5ac0bb5fab7ce4028e879d03/extract-left_0,top_30,width_400,height_300+resize-width_300/nice_file_name.png
            </div>
          </article>

          <div styleName="card__modal" id="card__modal">
            <button styleName="modal__close">Close</button>
            <article styleName="modal__content">
              <div>
                <img styleName="modal__image" id="modal__image" alt="" />
              </div>
              <div styleName="modal__footer" id="modal__footer" />
            </article>
          </div>

        </section>
      </main>
    );
  }
}

export default TransformationExamples;
