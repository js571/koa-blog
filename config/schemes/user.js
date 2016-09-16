var validator = require('validator');
var crypto = require('crypto');

var error = require('../../lib/output').error;

module.exports = {
  'POST /user': {
    "request": {
      "body": checkSignupBody
    }
  },
  'POST /login': {
    "request": {
      "body": checkLoginBody
    }
  }
};

function md5 (str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function checkLoginBody () {
  var body = this.request.body;
  if (!body || !body.name) {
    this.body = error('用户名为空');
    return false;
  }
  else if (!body.password) {
    this.body = error('请填写密码');
    return false;
  }
  body.name = validator.trim(body.name);
  body.password = md5(validator.trim(body.password));
  return true;
}

function checkSignupBody() {
  var body = this.request.body;
  if (!body || !body.name) {
    this.body = error('用户名为空');
    return false;
  }
  else if (body.name && !body.name.match(/^\w{4,12}$/)) {
    this.body = error('用户名长度必须长度在4-12个字母数字');
    return false;
  }
  else if (!body.email || !validator.isEmail(body.email)) {
    this.body = error('请填写正确邮箱地址');
    return false;
  }
  else if (!body.password) {
    this.body = error('请填写密码');
    return false;
  }
  else if (body.password && (body.password.length > 32 || body.password.length < 6)) {
    this.body = error('密码必须大于5位小于32位');
    return false;
  }
  else if (body.password !== body.re_password) {
    this.body = error('两次密码不匹配');
    return false;
  }
  else if (body.signature && body.signature.length > 50) {
    this.body = error('个性签名不能超过50字');
    return false;
  }
  body.name = validator.trim(body.name);
  body.email = validator.trim(body.email);
  body.password = md5(validator.trim(body.password));
  return true;
}