'use strict';
var outPut = require('../lib/output');
var Models = require('../lib/core');
var $User = Models.$User;

function setSession (data) {
  return {
    id: data._id,
    name: data.name,
    email: data.email,
    avatar: data.avatar,
    nickname: data.nickname,
    signature: data.signature
  }
}

module.exports = function (router) {
  /*
    获取用户列表
    queryString参数: {page: 0, size: 10}
  */
  router.get('/user', function *(next) {
    var data = yield $User.getUserList(this.query.page, this.query.size);
    this.body = outPut.success(data);
  });

  /*
  新增用户
  */
  router.post('/user', function *(next) {
    var data = this.request.body;
    var userExist = yield $User.getUserByName(data.name);
    if (userExist) {
      this.body = outPut.error(`用户${data.name}已存在`);
      return;
    }
    yield $User.addUser(data);
    this.body = outPut.success('');
  });

  /*
  登录
  */
  router.post('/login', function *(next) {
    var data = this.request.body;
    var userExist = yield $User.login(data.name, data.password);
    if (!userExist) {
      this.body = outPut.error(`用户名或密码错误`);
      return;
    }
    this.session.user = setSession(userExist);
    this.body = outPut.success(this.session.user);
  });

  /*
  获取单个用户的信息
  */
  router.get('/user/:id', function *(next) {
    var id = this.params.id;
    var user = yield $User.getUserById(id);
    this.body = outPut.success(user);
  });

  /*
  删除单个用户的信息
  */
  router.delete('/user/:id', function *(next) {
    var id = this.params.id;
    var user = yield $User.deleteUserById(id);
    this.body = outPut.success(user);
  });

  /*
  更新用户，id从session中取
  */
  router.put('/user', function *(next) {
    var data = this.request.body;
    var id = this.session.user.id;
    var userExist = yield $User.getUserById(id);
    if (!userExist) {
      this.body = outPut.error(`用户${data.name}不存在`);
      return;
    }
    var newData = Object.assign(userExist, data, {
      updated_at: Date.now
    });
    var modifyUser = yield $User.update(id, newData);
    this.session.user = setSession(newData);
    this.body = outPut.success(this.session.user);
  });
}