// Beginning Data
var app = {
  activeTeams: [],
  activePlayers: [],
  cap: {
    salaryFloor: 63000000,
    salaryCap: 70000000,
    luxuryTax: 84740000,
    hardCap: 88740000
  }
}

$.ajax({
  url: '/api/teams',
  type: 'get',
  success: function(data) {
    app.teams = data;
    outputTeamSelect();
  }
})

$.ajax({
  url: '/api/players',
  type: 'get',
  success: function(data) {
    app.players = data;
  }
})


// Making Team Select

function outputTeamSelect() {
  var number = $('#mainCollapsible').children().length
  $('#mainCollapsible').append('<li><div class="collapsible-header">Team '+(number+1)+'</div><div class="collapsible-body row" id="team'+(number+1)+'">'+outputImage()+'</div></li>')
  clickTeams();
}

function outputImage() {
  var string = ''
  for (var i = 0; i < app.teams.length; i++) {
    var newString = '<div class="col s4 m2 l1 logoContainer"><img src='+app.teams[i].imgsrc+' class="teamLogo responsive-img" id='+app.teams[i].teamId+' alt="'+app.teams[i].name+'"></div>'
    string = string + newString;
  }
  return string
}

function clickTeams() {
  $('#mainCollapsible').find('img').unbind()
  $('#mainCollapsible').children().last().find('img').on('click', function() {
    var teamId = parseInt($(this).prop('id'));
    $(this).addClass('selectedTeam');
    var formatData = {
      teamData: findTeam(teamId),
      playerData: findPlayersOnTeam(teamId),
      playersIn: [],
      playersOut: [],
      picksIn: [],
      picksOut: []
    }
    app.activeTeams.push(formatData)
    renderMachine();
    outputTeamSelect();
  });
  for (var i = 0; i < app.activeTeams.length; i++) {
    $('#mainCollapsible').children().last().find('#'+app.activeTeams[i].teamData.teamId).unbind()
    $('#mainCollapsible').children().last().find('#'+app.activeTeams[i].teamData.teamId).parent().addClass('usedTeam')
  }
}

function renderMachine() {
  $('#teamOutput').empty()
  for (var i = 0; i < app.activeTeams.length; i++) {
    renderTeam(app.activeTeams[i].teamData);
    renderPlayers(app.activeTeams[i].playerData);
    renderCapInfo(app.activeTeams[i]);
    renderTradeGive(app.activeTeams[i]);
    renderTradeReceive(app.activeTeams[i]);
    clickPlayerButton();
    clickPickButton();
    // unbinder();
    $('.playerCollapsible').collapsible();
    $('.picksCollapsible').collapsible();
  }
}

// On Click for player
function clickPlayerButton() {
  $('.playerTrade').on('click', function() {
    var playerID = parseInt($(this).prop('id').split('tradeTo')[0]);
    var teamID = parseInt($(this).prop('id').split('tradeTo')[1]);
    var originalTeam = findPlayer(playerID);
    for (var i = 0; i < app.activeTeams.length; i++) {
      if (app.activeTeams[i].teamData.teamId == originalTeam.teamId && checkPick(app.activeTeams[i].playersOut, playerID) == true) {
        app.activeTeams[i].playersOut.push(playerID)
      }
      if (app.activeTeams[i].teamData.teamId == teamID && checkPick(app.activeTeams[i].playersIn, playerID) == true) {
        app.activeTeams[i].playersIn.push(playerID)
      }
    }
    renderMachine()
  })
}

function clickPickButton() {
  $('.pickTrade').on('click', function() {
    var pickOriginalTeam = $(this).prop('id').split('20')[0];
    var pickYearRound = $(this).prop('id').split('20')[1].split('tradeTo')[0];
    var pickYear = parseInt('20'+pickYearRound.slice(0,2));
    var pickRound = parseInt(pickYearRound.slice(2));
    var teamID = parseInt($(this).prop('id').split('tradeTo')[1]);
    for (var i = 0; i < app.activeTeams.length; i++) {
      for (var j = 0; j < app.activeTeams[i].teamData.picks.length; j++) {
        var activePicks = app.activeTeams[i].teamData.picks[j]
        if (activePicks.year == pickYear && activePicks.round == pickRound && returnLastTeamName(activePicks.originalOwner) == pickOriginalTeam && checkPick(app.activeTeams[i].picksOut,app.activeTeams[i].teamData.picks[j]) == true) {
          app.activeTeams[i].picksOut.push(app.activeTeams[i].teamData.picks[j]);
          for (var k = 0; k < app.activeTeams.length; k++) {
            if (app.activeTeams[k].teamData.teamId == teamID && checkPick(app.activeTeams[k].picksIn, app.activeTeams[i].teamData.picks[j]) == true) {
              app.activeTeams[k].picksIn.push(app.activeTeams[i].teamData.picks[j]);
            }
          }
        }
      }
    }
    renderMachine()
  })
}

function checkPick(arrayToCheck, pickToCheck) {
  for (var i = 0; i < arrayToCheck.length; i++) {
    if (arrayToCheck[i] == pickToCheck) {
      return false
    }
  }
  return true
}

// function unbinder() {
//   $('.unbind').unbind()
// }

function returnLastTeamName(string) {
  var number = string.split(' ').length
  return string.split(' ')[(number-1)].toLowerCase()
}

// Render Team Card with all Divs as well as picks
function renderTeam(data) {
  $('#teamOutput').append('<div class="col s12 m6 l4"><div class="card"><div class="card-content white-text"><span class="card-title">'+data.name+'</span><div id="'+data.teamId+'TradeGive"></div><div id="'+data.teamId+'TradeReceive"></div><div id="'+data.teamId+'CapInfo"></div><h5>Players:</h5><div id="'+data.teamId+'Players"></div><h5>Picks:</h5><ul class="collapsible picksCollapsible" data-collapsible="accordion" id="'+data.teamId+'Picks">'+outputPicks(data.picks, data.teamId)+'</ul><div id="'+data.teamId+'TradeExceptions"></div></div></div></div>')
}

// Render Cap Info
function renderCapInfo(dataInput) {
  $('#'+dataInput.teamData.teamId+'CapInfo').append('<p>Team Salary: '+dataInput.teamData.salaryTotals[0]+' Cap Space: '+(app.cap.salaryCap - dataInput.teamData.salaryTotals[0])+'</p>'+runningSalary(dataInput))
}

function runningSalary(data) {
  var returnString = '<br><p>';
  if (data.playersIn.length == 0 && data.playersOut.length == 0) {
    return '';
  }
  if (data.playersIn.length > 0) {
    var salaryIn = 0;
    for (var i = 0; i < data.playersIn.length; i++) {
      var newData = findPlayer(data.playersIn[i])
      salaryIn = salaryIn + newData.contract[0].salary
    }
    returnString = returnString + 'Incoming Salary: '+salaryIn+'. '
  }
  if (data.playersOut.length > 0) {
    var salaryOut = 0;
    for (var i = 0; i < data.playersOut.length; i++) {
      var newData = findPlayer(data.playersOut[i])
      salaryOut = salaryOut + newData.contract[0].salary
    }
    returnString = returnString + 'Outgoing Salary: '+salaryOut+'.'
  }
  return returnString + '</p>'
}

// Renders the Players and Picks to be traded
function renderTradeGive(data) {
  if (data.picksOut.length > 0 || data.playersOut.length > 0) {
    $('#'+data.teamData.teamId+'TradeGive').append('<div class="left-align"><h6>Trade Away:</h6><div id="'+data.teamData.teamId+'GivePlayer"></div><div id="'+data.teamData.teamId+'GivePick"></div></div>')
  }
  if (data.playersOut.length > 0) {
    $('#'+data.teamData.teamId+'GivePlayer').append('<h6>Players: </h6><ul>'+renderPlayersTrade(data.playersOut)+'</ul>')
  }
  if (data.picksOut.length > 0) {
    $('#'+data.teamData.teamId+'GivePick').append('<h6>Picks: </h6><ul>'+renderPicksTrade(data.picksOut)+'</ul>')
  }
}

function renderTradeReceive(data) {
  if (data.picksIn.length > 0 || data.playersIn.length > 0) {
    $('#'+data.teamData.teamId+'TradeReceive').append('<div class="left-align"><h6>Receive in Trade:</h6><div id="'+data.teamData.teamId+'ReceivePlayer"></div><div id="'+data.teamData.teamId+'ReceivePick"></div></div>')
  }
  if (data.playersIn.length > 0) {
    $('#'+data.teamData.teamId+'ReceivePlayer').append('<h6>Players: </h6><ul>'+renderPlayersTrade(data.playersIn)+'</ul>')
  }
  if (data.picksIn.length > 0) {
    $('#'+data.teamData.teamId+'ReceivePick').append('<h6>Picks: </h6><ul>'+renderPicksTrade(data.picksIn)+'</ul>')
  }
}

function renderPlayersTrade(data) {
  var string = '';
  for (var i = 0; i < data.length; i++) {
    var newData = findPlayer(data[i]);
    var newString = '<li><div class="chip">'+newData.name+' <em>'+newData.contract[0].salary+'</em></div></li>'
    string = string + newString;
  }
  return string;
}

function renderPicksTrade(data) {
  var string = '';
  for (var i = 0; i < data.length; i++) {
    var newString = '<li><div class="chip">'+data[i].originalOwner+' '+data[i].year+' '+returnRound(data[i].round)+' round pick</div></li>'
    string = string + newString;
  }
  return string;
}

// Render the Players
function renderPlayers(data) {
  $('#'+data[0].teamId+'Players').append('<ul class="collapsible playerCollapsible" data-collapsible="accordion">'+returnPlayers(data)+'</ul>')
}

function returnPlayers(playerArray) {
  var string = ' '
  for (var i = 0; i < playerArray.length; i++) {
    string = string + '<li><div class="collapsible-header">'+playerArray[i].name+' Salary: $'+playerArray[i].contract[0].salary+'</div><div class="collapsible-body"><h6>Trade to:</h6><p> '+returnTeamsToTradeTo(playerArray[i])+'</p></div></li>'
  }
  return string
}

function returnTeamsToTradeTo(objectPlayer) {
  var string =''
  for (var i = 0; i < app.activeTeams.length; i++) {
    if (app.activeTeams[i].teamData.teamId != objectPlayer.teamId) {
      var newString = '<br><a class="waves-effect waves-white btn-flat playerTrade" id="'+objectPlayer.playerId+'tradeTo'+app.activeTeams[i].teamData.teamId+'">'+app.activeTeams[i].teamData.name+'</a>'
      string = string + newString
    }
  }
  return string
}

// Render the Picks
function outputPicks(picksArray, teamID) {
  var string = ' ';
  for (var i = 0; i < picksArray.length; i++) {
    var string = string + '<li><div class="collapsible-header">'+picksArray[i].originalOwner+' '+picksArray[i].year+' '+returnRound(picksArray[i].round)+' round pick</div><div class="collapsible-body"><h6>Description:</h6> <p>'+cutDescription(picksArray[i].description)+'</p><h6>Trade to:</h6><p> '+returnTeamsToTradePicksTo(picksArray[i], teamID)+'</p></div></li>'
  }
  return string
}

function cutDescription(string) {
  return string.split('[')[0]
}

function returnTeamsToTradePicksTo(objectPick, teamID) {
  var string =''
  for (var i = 0; i < app.activeTeams.length; i++) {
    if (app.activeTeams[i].teamData.teamId != teamID) {
      var newString = '<br><a class="waves-effect waves-white btn-flat pickTrade" id="'+returnOwnerForID(objectPick.originalOwner)+objectPick.year+objectPick.round+'tradeTo'+app.activeTeams[i].teamData.teamId+'">'+app.activeTeams[i].teamData.name+'</a>'
      string = string + newString
    }
  }
  return string
}

function returnOwnerForID(ownerName) {
  var last = ownerName.split(' ').length
  return ownerName.split(' ')[(last-1)].toLowerCase()
}

function returnRound(roundNumber) {
  if (roundNumber == 1) {
    return 'first'
  } else if (roundNumber == 2) {
    return 'second'
  }
}

// Finding players, teams and players on teams
function findPlayersOnTeam(teamID) {
  var returnArray = []
  for (var i = 0; i < app.players.length; i++) {
    if (app.players[i].teamId == teamID) {
      returnArray.push(app.players[i])
    }
  }
  return returnArray;
}

function findTeam(teamID) {
  var returnArray = []
  for (var i = 0; i < app.teams.length; i++) {
    if (app.teams[i].teamId == teamID) {
      returnArray.push(app.teams[i])
      break;
    }
  }
  return returnArray[0]
}

function findPlayer(playerID) {
  var returnArray = []
  for (var i = 0; i < app.players.length; i++) {
    if (app.players[i].playerId == playerID) {
      returnArray.push(app.players[i])
      break;
    }
  }
  return returnArray[0]
}
