var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  password: { type: String, required: true },
  gender: { type: Number, default: 1 }, // 1: 男 0： 女
  nickname: { type: String, default: ''},
  signature: {type: String, default: ''},
  avatar : {type:String, default: ''},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

UserSchema.index({name: 1});

module.exports = mongoose.model('User', UserSchema);