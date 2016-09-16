'use strict';

module.exports = function (router) {
  router.get('/topic', function *(next) {
    this.body = 'hello topic';
  });
}