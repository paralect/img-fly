const mount = require('koa-mount');

const uploadResource = require('resources/upload');

const defineRoutes = (app) => {
  app.use(mount('/upload', uploadResource));
};

module.exports = defineRoutes;
