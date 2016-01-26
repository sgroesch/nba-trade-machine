var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Pick = new Schema({
  type: String,
  team: String,
  year: Number,
  round: Number,
  description: String
});

var Deadmoney = new Schema({
  year: Number,
  instances: [{
    player: String,
    amount: Number
  }]
});

// var Tradeexception = new Schema({
//   player: String,
//   until: Number, // Date?
//   amount: Number
// })

var Team = new Schema({
  teamId: Number,
  name: String,
  city: String,
  imgSrc: String,
  players: [Number],
  picks: [Pick],
  deadMoney: [Deadmoney]
  // tradeExceptions: [Tradeexception]
});

module.exports.Team = mongoose.model('Team', Team);
module.exports.Pick = mongoose.model('Pick', Pick);
module.exports.Deadmoney = mongoose.model('Deadmoney', Deadmoney);
