# Img Fly
[![Stack](https://raw.githubusercontent.com/paralect/stack/master/stack-component-template/stack.png)](https://github.com/paralect/stack)

[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Build Status](http://product-stack-ci.paralect.com/api/badges/paralect/img-fly/status.svg)](http://product-stack-ci.paralect.com/paralect/img-fly)
[![David Dependancy Status](https://david-dm.org/paralect/img-fly.svg)](https://david-dm.org/paralect/img-fly)

[![Watch on GitHub](https://img.shields.io/github/watchers/paralect/img-fly.svg?style=social&label=Watch)](https://github.com/paralect/img-fly/watchers)
[![Star on GitHub](https://img.shields.io/github/stars/paralect/img-fly.svg?style=social&label=Stars)](https://github.com/paralect/img-fly/stargazers)
[![Follow](https://img.shields.io/twitter/follow/paralect.svg?style=social&label=Follow)](https://twitter.com/paralect)
[![Tweet](https://img.shields.io/twitter/url/https/github.com/paralect/img-fly.svg?style=social)](https://twitter.com/intent/tweet?text=Check%20out%20Img%20Fly%20%F0%9F%A6%8B%20%E2%80%94%20an%20open-source,%20docker%20based%20service%20for%20uploading%20and%20manipulating%20images%20on%20a%20fly%20https://github.com/paralect/img-fly)

Docker based service for uploading and transforming images on the fly 🦋. Based on native, ultra fast [Sharp](http://sharp.pixelplumbing.com/en/stable/performance/#the-task) and [Amazon S3](https://aws.amazon.com/s3/).

## Features

* 🔥️ **Transform images on the fly** Upload image and apply transformation by adding them to the url. Similar to [Cloudinary](https://cloudinary.com/).
* 😍 **Resize, Crop, Face detection** and other image transformations. Based on [Sharp](http://sharp.pixelplumbing.com/en/stable/install/)
* 🙀 **Amazon S3 as file storage** we store original uploads and all transformations over to your S3 bucket.
* 🤗 **Upload directly from client app.** .
* ️⚡️ **Easy to use** Img Fly is a Node.JS based microservice, shipped in Docker container.
* 💰 **Automated S3 storage cleanup.** We cleanup your S3 bucket if file isn't accessed for over 30 days. ImgFly saves your money. *(planned)*
* 👮‍♂️ **Secure** — we keep all uploads and file access secure by verifying `md5(resourceId,imgFlySecretKey)`. *(planned)*


## Getting Started

### Play around

1. Clone this repo
2. Create `.env` file with Amazon s3 credentials (see [.env.example](./.env.example)).
3. Start a project using `./bin/start.sh`. 
4. Navigate to the `http://localhost:3002/` and upload image file.
5. Click on the transformation link and play around with url params. 

Extract + Resize example:
`http://localhost:3001/5ac0bb5fab7ce4028e879d03/extract-left_0,top_30,width_400,height_300+resize-width_300/nice_file_name.png`

### Add ImgFly to your project

ImgFly shipped as [Docker container](https://hub.docker.com/r/paralect/img-fly/tags/). If you already using [docker-compose for your project](https://github.com/paralect/docker-compose-starter) it won't take more than 5 minutes to install and start using ImgFly. 

You'll need to add following to your docker-compose file. [Full installation and usage guide](./INSTALL.md)
```yml
img-fly:
    image: paralect/img-fly:v0.2.2
    ports:
      - "3003:3001"
    environment:
      NODE_ENV: "production"
      IMG_FLY_AWS_SECRET_KEY: "YOUR AWS SECRET"
      IMG_FLY_AWS_ACCESS_KEY: "YOUR AWS ACCESS KEY"
      IMG_FLY_AWS_S3_REGION: "YOUR AWS REGION"
      IMG_FLY_AWS_S3_BUCKET: "YOUR BUCKET NAME"
      IMG_FLY_MONGO_CONNECTION: "mongodb://mongo:27017/img-fly-dev"
      IMG_FLY_MONGO_COLLECTION: "img-fly_files"
      IMG_FLY_API_URL: "http://localhost:3003"
      IMG_FLY_DEBUG: "true"
```
### Supported transformations

1. [Extract](http://sharp.pixelplumbing.com/en/stable/api-operation/#extract)
2. [Resize](http://sharp.pixelplumbing.com/en/stable/api-resize/#resize)
    - [Crop](http://sharp.pixelplumbing.com/en/stable/api-resize/#crop)
    - [Embed](http://sharp.pixelplumbing.com/en/stable/api-resize/#embed)
    - [Max](http://sharp.pixelplumbing.com/en/stable/api-resize/#max)
    - [withoutEnlargement](http://sharp.pixelplumbing.com/en/stable/api-resize/#withoutEnlargement)
3. [Extract](http://sharp.pixelplumbing.com/en/stable/api-operation/#extract)
4. [Blur](http://sharp.pixelplumbing.com/en/stable/api-operation/#blur)
5. [toFormat](http://sharp.pixelplumbing.com/en/stable/api-output/#toformat)
6. [Grayscale filter](http://sharp.pixelplumbing.com/en/stable/api-colour/#grayscale)

[All transformations (code)](https://github.com/paralect/img-fly/tree/master/src/service/src/transformations)

Feel free to submit PR's with more transformations. You'll need to implement a function which maps query params to the [sharp](http://sharp.pixelplumbing.com/) function params.

#### Building transfomration query
We use following rules to form query params. 
1. `+` is used to combine multiple transformations.
2. `-` is used as separator between transformation name and params.
3. `_` is used to separate param name and param value;

Example of applying extract & resize transformations: `extract-left_0,top_30,width_400,height_300+resize-width_300`

Example of resize and crop: `resize-width_300,height_300+crop-strategy_attention`

## Demo

N/A

## Change Log

This project adheres to [Semantic Versioning](http://semver.org/).
Every release is documented on the Github [Releases](https://github.com/paralect/img-fly/releases) page.

## License

Ship is released under the [MIT License](LICENSE).

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/6461311?v=4" width="100px;"/><br /><sub><b>Evgeny Zhivitsa</b></sub>](https://github.com/ezhivitsa)<br />[💻](https://github.com/paralect/ship/commits?author=ezhivitsa "Code") [📖](https://github.com/paralect/ship/commits?author=ezhivitsa "Documentation") [🤔](#ideas-ezhivitsa "Ideas, Planning, & Feedback") [👀](#review-ezhivitsa "Reviewed Pull Requests") [⚠️](https://github.com/paralect/ship/commits?author=ezhivitsa "Tests") | [<img src="https://avatars3.githubusercontent.com/u/2302873?v=4" width="100px;"/><br /><sub><b>Ihar</b></sub>](https://github.com/IharKrasnik)<br />[💻](https://github.com/paralect/ship/commits?author=IharKrasnik "Code") [📖](https://github.com/paralect/ship/commits?author=IharKrasnik "Documentation") [🤔](#ideas-IharKrasnik "Ideas, Planning, & Feedback") [👀](#review-IharKrasnik "Reviewed Pull Requests") | [<img src="https://avatars3.githubusercontent.com/u/681396?v=4" width="100px;"/><br /><sub><b>Andrew Orsich</b></sub>](http://paralect.com)<br />[💻](https://github.com/paralect/ship/commits?author=anorsich "Code") [📖](https://github.com/paralect/ship/commits?author=anorsich "Documentation") [🤔](#ideas-anorsich "Ideas, Planning, & Feedback") |
| :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
