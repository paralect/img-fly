module.exports = {
  storage: {
    type: 'mongo',
    connection: 'mongodb://mongo:27017/img-fly-development',
    collection: 'img-fly-files',
  },
  apiUrl: 'http://localhost:3001',
};
