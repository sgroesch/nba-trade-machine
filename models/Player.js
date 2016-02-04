var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var Contract = new Schema({
//   year: Number,
//   salary: Number,
//   option: String
// })

var Player = new Schema({
  playerId: Number,
  name: String,
  firstName: String,
  lastName: String,
  // seasonExp: Number,
  // position: String,
  teamId: Number,
  teamName: String,
  freeAgencyStatus: String,
  contract: [{
    year: Number,
    salary: Number,
    option: String
  }]
});

// Add country, school, birthplace so can map data

module.exports.Player = mongoose.model('Player', Player);
// module.exports.Contract = mongoose.model('Contract', Contract);
