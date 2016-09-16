var crypto = require('crypto');
var User = require('../models').User;

function md5 (str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

//新建一个用户
exports.addUser = function (data) {
  return User.create(data);
};

//通过id获取用户
exports.getUserById = function (id) {
  return User.findbyId(id).exec();
};

//通过name获取用户
exports.getUserByName = function (name) {
  return User.findOne({name: name}).exec();
};

exports.login = function (name, password) {
  return User.findOne({name: name, password: password}).exec();
};