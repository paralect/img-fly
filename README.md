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

Docker based service for uploading and transforming images on the fly 🦋. 

## An idea

Img Fly is a simple service which allow uploading and manipulating images on a fly. 
1. As a developer I can upload my image to the `/upload` endpoint. 
2. As a developer I can specify my Amazon S3 bucket using environment variables.
3. As a developer I can point use `/w_200/puppy.png` endpoint to resize image width to be 200px. 
4. Once image processed it is get cached on S3, when image is not used for over 30 days (via config) image should be deleted on s3.
5. As a developer I can upload images directly from a browser. 

⚠️ — at the moment 1-3 is implemented. Use with caution, the service is still in early days. All transformations are applied on the fly and do not persisted to the S3 bucket.

Basic security: 
1. To secure uploads we could use simple `md5(secret, id)` approach. As a developer I generate simple imgFlyToken from a secret (configured in a config) and some id (that could be current userId, resourceId or whatever else)
2. By default, if strict security isn't required we could return direct S3 url as a header for `/w_200/puppy.png` request. 
3. If security is an issue, we could return URL as a header with `md5(secret, imageName)`

Tools: 
1. Image processing based on [sharp](https://github.com/lovell/sharp)
2. Amazon S3 by default as file storage (file system later on).

## Getting Started

1. Clone this repo
2. Create `.env` file with Amazon s3 credentials (see [.env.example](./.env.example)).
3. Start a project using `./bin/start.sh`. 
4. Navigate to the `http://localhost:3002/` and upload image file.
5. Click on the transformation link and play around with url params. 

Extract + Resize example:
`http://localhost:3001/5ac0bb5fab7ce4028e879d03/extract-left_0,top_30,width_400,height_300+resize-width_300/nice_file_name.png`


### Supported transformations

1. [Extract](http://sharp.pixelplumbing.com/en/stable/api-operation/#extract)
2. [Resize](http://sharp.pixelplumbing.com/en/stable/api-resize/#resize)

Feel free to submit PR's with more transformations. You'll need to implement a function which maps query params to the [sharp](http://sharp.pixelplumbing.com/) function params.

We use following rules to form query params. 
1. `+` is used to combine multiple transformations.
2. `-` is used as separator between transformation name and params.
3. `_` is used to separate param name and param value;

Example of applying extract & resize transformations: `extract-left_0,top_30,width_400,height_300+resize-width_300`

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
