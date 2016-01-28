var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Contract = new Schema({
  playerId: Number,
  year: Number,
  salary: Number,
  option: String
})

var Player = new Schema({
  playerId: Number,
  name: String,
  seasonExp: Number,
  position: String,
  teamId: Number,
  teamName: String,
  teamCity: String,
  signedUsing: String,
  freeAgencyStatus: String,
  contract: [Contract]

});

// Add country, school, birthplace so can map data

module.exports.Player = mongoose.model('Player', Player);
module.exports.Contract = mongoose.model('Contract', Contract);
