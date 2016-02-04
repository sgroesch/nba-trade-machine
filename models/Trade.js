var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var Comment = new Schema({
//   userId: Number,
//   author: String,
//   tradeId: Number,
//   upvotedIds: [Number],
//   downvotedIds [Number]
// })

var Trade = new Schema({
  userId: Number,
  author: String,
  public: Boolean,
  teams: [{
    teamName: String,
    teamId: Number,
    playersIn: [Number],
    playersOut: [Number],
    picksIn: [{
      from: Number,
      type: String,
      year: Number,
      round: Number,
      originalOwner: String,
      description: String
    }],
    picksOut: [{
      to: Number,
      type: String,
      year: Number,
      round: Number,
      originalOwner: String,
      description: String
    }]
  }]
});

module.exports.Trade = mongoose.model('Trade', Trade);
