var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Contract = new Schema({
  amounts: [Number],
  signedUsing: String,
  playerOption: Boolean,
  teamOption: Boolean
})

var Player = new Schema({
  playerId: Number,
  name: String,
  firstName: String,
  lastName: String,
  birthdate: String,
  school: String,
  country: String,
  height: String,
  weight: Number,
  seasonExp: Number,
  jersey: Number,
  position: String,
  rosterStatus: String,
  teamId: Number,
  teamName: String,
  teamCity: String,
  rookieYear: Number,
  contract: []

});

module.exports.Player = mongoose.model('Player', Player);
