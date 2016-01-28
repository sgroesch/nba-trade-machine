var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var Comment = new Schema({
//   userId: Number,
//   author: String,
//   tradeId: Number,
//   upvotedIds: [Number],
//   downvotedIds [Number]
// })

var Teamtrade = new Schema({
  teamName: String,
  teamId: Number,
  playersIn: [Number],
  playersOut: [Number],
  picksIn: [],
  picksOut: []
})

var Trade = new Schema({
  userId: Number,
  public: Boolean,
  teams: [Teamtrade]

  playersIn: [Playermove],
  playersOut: [Playermove],
  comments: [Comment],
});

module.exports.Trade = mongoose.model('Trade', Trade);
