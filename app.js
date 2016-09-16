var app = require('koa')();
var logger = require('koa-logger');
var bodyparser = require('koa-bodyparser');
var session = require('koa-generic-session');
var MongoStore = require('koa-generic-session-mongo');
var gzip = require('koa-gzip');
var scheme = require('koa-scheme');

var config = require('config-lite');
var errorhandler = require('./lib/error');

// 不放到 default.js 是为了避免循环依赖
var merge = require('merge-descriptors');
// 获取导出的Model对象
var core = require('./lib/core');
var routerInit = require('./routes');
app.keys = [config.name];

app.use(errorhandler());
app.use(bodyparser());
app.use(logger());
app.use(session({
  store: new MongoStore(config.mongodb)
}));
app.use(scheme(config.schemeConf));
app.use(gzip());
routerInit(app);


if (module.parent) {
  module.exports = app.callback();
} else {
  app.listen(config.port, function () {
    console.log('Server listening on: ', config.port);
  });
}