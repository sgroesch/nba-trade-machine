var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Account = new Schema({
  username: String, //required names for passport
  password: String, //required names for passport
  email: String
});

Account.plugin(passportLocalMongoose);

module.exports.Account = mongoose.model('Account', Account);
