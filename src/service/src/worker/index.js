// allows require modules relative to /src folder
// for example: require('lib/mongo/idGenerator')
// all options can be found here: https://gist.github.com/branneman/8048520
const path = require('path');

const rootPath = path.join(__dirname, '../');
require('app-module-path').addPath(rootPath);
global.logger = require('logger');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const Consumer = require('./consumer');
const storage = require('storage');

const { logger } = global;

const consumer = new Consumer(storage);
consumer.run();
logger.info('Started ImgFly background worker', new Date());
