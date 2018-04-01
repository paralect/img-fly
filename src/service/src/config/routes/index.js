const mount = require('koa-mount');

const uploadResource = require('resources/upload');
const fetchResource = require('resources/fetch');

const defineRoutes = (app) => {
  app.use(mount('/upload', uploadResource));
  app.use(mount('/', fetchResource));
};

module.exports = defineRoutes;
