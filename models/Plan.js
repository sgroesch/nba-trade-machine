var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
  userId: Number,
  author: String,
  planId: Number,
  upvotedIds: [Number],
  downvotedIds [Number]
})

var Playermove = new Schema({

})

var Plan = new Schema({
  userId: Number,
  teamId: Number,
  playersIn: [Playermove],
  playersOut: [Playermove],
  comments: [Comment],
  upvotedIds: [Number],
  downvotedIds [Number]
});

module.exports.Plan = mongoose.model('Plan', Plan);
