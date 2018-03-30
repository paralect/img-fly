const axios = require('axios');
const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const config = require('config');

const { logger } = global;

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
