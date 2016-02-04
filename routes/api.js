var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var teamData = JSON.parse(fs.readFileSync('./seeds/teams.json', 'utf8'));
var playerData = JSON.parse(fs.readFileSync('./seeds/players.json', 'utf8'));

router.get('/players', function(req, res, next) {
  res.json(playerData);
});

router.get('/players/:id', function(req, res, next) {
  var sendObject = findPlayer(req.params.id)
  res.json(sendObject);
});

router.get('/teams', function(req, res, next) {
  res.json(teamData);
});

router.get('/teams/:id', function(req, res, next) {
  var sendObject = findTeam(req.params.id)
  res.json(sendObject);
});

router.get('/teams/:id/players', function(req, res, next) {
  var returnArray = []
  var sendObject = findTeam(req.params.id)
  for (var i = 0; i < sendObject.players.length; i++) {
    var playerObject = findPlayer(sendObject.players[i])
    returnArray.push(playerObject)
  }
  res.json(returnArray);
});

function findTeam(teamID) {
  var returnArray = []
  for (var i = 0; i < teamData.length; i++) {
    if (teamData[i].teamId == teamID) {
      returnArray.push(teamData[i])
      break;
    }
  }
  return returnArray[0]
}

function findPlayer(playerID) {
  var returnArray = []
  for (var i = 0; i < playerData.length; i++) {
    if (playerData[i].playerId == playerID) {
      returnArray.push(playerData[i])
      break;
    }
  }
  return returnArray[0]
}

module.exports = router;
