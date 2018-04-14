const _ = require('lodash');
const path = require('path');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';

let base = {
  env,
  port: process.env.PORT || 3001,
  isDev: env === 'development',
  isTest: env === 'test',
  aws: {
    accessKey: process.env.IMG_FLY_AWS_ACCESS_KEY,
    secretKey: process.env.IMG_FLY_AWS_SECRET_KEY,
    region: process.env.IMG_FLY_AWS_S3_REGION,
    bucket: process.env.IMG_FLY_AWS_S3_BUCKET,
  },
  storage: {
    type: 'mongo',
    connection: process.env.IMG_FLY_MONGO_CONNECTION,
    collection: process.env.IMG_FLY_MONGO_COLLECTION,
  },
  apiUrl: process.env.IMG_FLY_API_URL,
};

const envConfig = require(`./${env}.js`); // eslint-disable-line

base = _.merge(base, envConfig || {});

const loadLocalConfig = (name) => {
  const localConfigPath = path.join(__dirname, name);
  if (fs.existsSync(localConfigPath)) {
    base = _.merge(base, require(localConfigPath)); // eslint-disable-line
    console.log(`loaded ${localConfigPath} config`); // eslint-disable-line
  }
};

// local file can be used to customize any config values during development
if (base.env === 'test') {
  loadLocalConfig('test-local.js');
} else {
  loadLocalConfig('local.js');
}
module.exports = base;
