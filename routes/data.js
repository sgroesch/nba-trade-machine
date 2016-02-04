var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var teamData = JSON.parse(fs.readFileSync('./seeds/teams.json', 'utf8'));
var playerData = JSON.parse(fs.readFileSync('./seeds/players.json', 'utf8'));

var combinedData = {
  teams: teamData,
  players: playerData
};

router.get('/', function(req, res, next) {
  res.render('data', { user: req.user, pageHeader: 'NBA Data', data: combinedData });
});

router.get('/players/:id', function(req, res, next) {
  var sendObject = findPlayer(req.params.id)
  res.render('playerdata', { user: req.user, pageHeader: sendObject.name+' Data', data: sendObject });
});

router.get('/teams/:id', function(req, res, next) {
  var sendObject = findTeam(req.params.id)
  res.render('teamdata', { user: req.user, pageHeader: sendObject.name+' Data', data: sendObject });
});

router.get('/leagueleaders', function(req, res, next) {
  var leagueLeaders = {}
  request('http://stats.nba.com/stats/leagueleaders?StatCategory=PTS&LeagueID=00&PerMode=PerGame&Season=2015-16&SeasonType=Regular+Season&Scope=RS', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      leagueLeaders = JSON.parse(body)
      var array = []
      for (var i = 0; i < leagueLeaders.resultSet.rowSet.length; i++) {
        var object = {}
        object.id = leagueLeaders.resultSet.rowSet[i][0]
        object.name = leagueLeaders.resultSet.rowSet[i][2]
        object.min = leagueLeaders.resultSet.rowSet[i][5]
        object.points = leagueLeaders.resultSet.rowSet[i][22]
        object.rebounds = leagueLeaders.resultSet.rowSet[i][17]
        object.assists = leagueLeaders.resultSet.rowSet[i][18]
        object.steals = leagueLeaders.resultSet.rowSet[i][19]
        object.blocks = leagueLeaders.resultSet.rowSet[i][20]
        object.FG = percentify(leagueLeaders.resultSet.rowSet[i][8])
        object.TP = percentify(leagueLeaders.resultSet.rowSet[i][11])
        object.FT = percentify(leagueLeaders.resultSet.rowSet[i][14])
        array.push(object)
      }
    }
    res.render('leagueleaders', { user: req.user, pageHeader: 'NBA League Leaders', data: array });
  })
});

function percentify(decimalNum) {
  return (decimalNum*100).toFixed(1);
}

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
