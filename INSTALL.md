## ImgFly Installation guide

### Add ImgFly on your development environment

Add following to your docker-compose file (or run containers on your own):

```yaml
version: '3.3'
services:
  mongo:
    command: mongod
    image: mongo:3.6.3
    ports:
      - "27017:27017"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
  img-fly:
    image: paralect/img-fly:v0.2.2
    ports:
      - "3003:3001"
    depends_on:
      - mongo
    links:
      - mongo
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
  
  # worker is used to process transformations and other tasks in background
  img-fly-worker:
    image: paralect/img-fly:v0.2.2
    command: npm run start-worker
    depends_on:
      - mongo
    links:
      - mongo
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

### Upload files to imgFly from client app

```javascript
  uploadFile = (file) => {
    const data = new FormData();
    data.append('file', file);
    apiClient.post('/upload', data)
      .then((res) => {
        const originalUrl = res.files[0].url;
        const originalName = res.files[0].name;
        const baseTransformUrl = originalUrl.replace(originalName, '');
        const sampleTransformUrl = `${baseTransformUrl}resize-width_1080,height_1080+max/${originalName}`;
      });
  }
```

### Upload files to imgFly from Node.JS app

```javascript
const request = require('request');
const config = require('config');

// Upload url to the ImgFly
const uploaFromdUrl = (url) => {
  const fileStream = request.get(url);

  const formData = {
    file: fileStream,
  };
  return new Promise((resolve, reject) => {
    request.post({ url: `${config.imgFlyInternalUrl}/upload`, formData }, (err, res, body) => {
      if (err) {
        reject(err);
        return;
      }
      const bodyJson = JSON.parse(body);
      const { 0: file } = bodyJson.files;
      resolve(file);
    });
  });
};

// Read img-fly unique file header
const getUniqueUrl = (id, fileName, transform) => {
  const requestUrl = `${config.imgFlyUrl}/${id}/${transform}/${fileName}`;
  return new Promise((resolve, reject) => {
    request.get(requestUrl, (err, res, body) => {
      if (err) {
        reject(err);
        return;
      }

      const fileUrl = res.headers.imgfly_fileurl;
      resolve(fileUrl);
    });
  });
};

// Create transformations without downloading files
const createTransformations = (originalFileId, transformTasks) => {
  const requestUrl = `${config.imgFlyUrl}/${originalFileId}`;
  return new Promise((resolve, reject) => {
    request.post(requestUrl, {
      form: {
        transformTasks,
      },
    }, (err, res, body) => {
      if (err) {
        reject(err);
        return;
      }
      if (res.statusCode === 400) {
        const errorRes = JSON.parse(body);
        resolve({
          hasErrors: true,
          errors: errorRes.errors,
        });

        return;
      }

      resolve(JSON.parse(body));
    });
  });
};

module.exports.uploaFromdUrl = uploaFromdUrl;
module.exports.getUniqueUrl = getUniqueUrl;
module.exports.createTransformations = createTransformations;
```