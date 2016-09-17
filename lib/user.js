var crypto = require('crypto');
var User = require('../models').User;

function md5 (str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

//新建一个用户
exports.addUser = function addUser(data) {
  return User.create(data);
};

//删除一个用户
exports.deleteUserById = function deleteUserById(id) {
  return User.remove({_id: id}).exec();
};

//通过id获取用户
exports.getUserById = function getUserById (id) {
  return User.findOne({_id: id}).select('-password').exec();
};

//通过name获取用户
exports.getUserByName = function getUserByName(name) {
  return User.findOne({name: name}).exec();
};

exports.login = function login(name, password) {
  return User.findOne({name: name, password: password}).exec();
};

//获取不同标签的话题数
exports.getUserCount = function getUserCount() {
  return User.count().exec();
};

exports.getUserList = function getUserList(page, size) {
  var count = this.getUserCount();
  var list = User.find().skip(page * size).limit(size).select('-password').exec();
  return {
    count,
    list,
    page,
    size
  };
};

exports.update = function update(id, query) {
  delete query._id;
  return User.findByIdAndUpdate(id, query).exec();
}
