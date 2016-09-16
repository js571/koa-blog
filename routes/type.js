'use strict';

module.exports = function (router) {
  router.get('/types', function *(next) {
    this.body = 'hello types';
  });
}