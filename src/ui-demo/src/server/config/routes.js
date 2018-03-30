const Router = require('koa-router');
const config = require('config');

const indexRouter = new Router();

// match all routes but not files (i.e. routes with dots)
indexRouter.get(/^((?!\.).)*$/, async (ctx) => {
  const data = {
    isDev: config.isDev,
    config: {
      apiUrl: config.apiUrl,
    },
    user: {},
    token: '',
  };

  return ctx.render('index', data);
});

module.exports = indexRouter.routes();
