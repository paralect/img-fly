const Router = require('koa-router');

const router = new Router();
const controller = require('./fetch.controller');

router.get('/:id/:fileName', controller.getFile);
router.get('/:id/:transform/:fileName', controller.getFile);

module.exports = router.routes();
