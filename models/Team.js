var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Team = new Schema({
  teamId: Number,
  name: String,
  location: String,
  simpleName: String,
  abbreviation: String,
  imgsrc: String,
  hardcapped: Boolean,
  picks: [{
    type: String,
    year: Number,
    round: Number,
    originalOwner: String,
    description: String
  }],
  deadMoney: [{
    playerName: String,
    instances: [{
      year: Number,
      amount: Number
    }]
  }],
  tradeExceptions: [{
    player: String,
    amount: Number,
    expires: String
  }],
  players: [Number]
});

module.exports.Team = mongoose.model('Team', Team);
