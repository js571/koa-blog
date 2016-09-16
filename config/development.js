var path = require('path');

module.exports = {
  port: process.env.PORT || 3000,
  name: 'N-club',
  mongodb: {
    url: 'mongodb://127.0.0.1:27017/koa_blog'
  },
  schemeConf: path.join(__dirname, './default.scheme'),
  routerConf: 'routes',
  routerCacheConf: {
    '/': {
      expire: 10 * 1000,
      condition: function() {
        return !this.session || !this.session.user;
      }
    }
  }
};