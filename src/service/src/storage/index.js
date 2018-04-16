const config = require('config');

// This is the way to implement more storages for files in the future
const getStorage = (type) => {
  switch (type) {
    default:
      return require('./mongo.storage'); // eslint-disable-line
  }
};

const storage = getStorage(config.storage.type);

module.exports = storage;
