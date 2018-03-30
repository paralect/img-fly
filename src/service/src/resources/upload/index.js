const Router = require('koa-router');

const router = new Router();
const controller = require('./upload.controller');

router.post('/upload', controller.upload);

module.exports = router.routes();
