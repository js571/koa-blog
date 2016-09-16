'use strict';
var outPut = require('../lib/output');
var Models = require('../lib/core');
var $User = Models.$User;

module.exports = function (router) {
  router.get('/user', function *(next) {
    this.body = {a: 1233};
  });

  router.post('/user', function *(next) {
    var data = this.request.body;
    var userExist = yield $User.getUserByName(data.name);
    if (userExist) {
      this.body = outPut.error(`用户${data.name}已存在`);
      return;
    }
    yield $User.addUser(data);
    this.session.user = {
      name: data.name,
      email: data.email
    };
    this.body = outPut.success(this.session.user);
  });

  router.post('/login', function *(next) {
    var data = this.request.body;
    var userExist = yield $User.login(data.name, data.password);
    if (!userExist) {
      this.body = outPut.error(`用户名或密码错误`);
      return;
    }
    this.session.user = {
      name: data.name,
      email: data.email,
      avatar: userExist.avatar,
      nickname: userExist.nickname,
      signature: userExist.signature
    };
    this.body = outPut.success(this.session.user);
  });


  // router.post('/login',controller.login);
  // router.post('/add',auth.hasRole,controller.add);
  // router.get('/list',auth.hasRole,controller.list);
  // router.put('/:id/update', auth.hasRole, controller.update);
  // router.delete('/:id', auth.hasRole, controller.delete);
  // router.get('/:id/info', auth.hasRole, controller.get);
}