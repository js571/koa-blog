'use strict';
var router = require('koa-router')();

module.exports = function(app) {
  require('./user')(router);
  require('./topic')(router);
  require('./type')(router);
  app.use(router.routes());
};
