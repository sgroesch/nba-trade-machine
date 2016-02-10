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
    // renderPlayersTrade(app.activeTeams[i])
    // renderPicksTrade(app.activeTeams[i])
    $('.playerCollapsible').collapsible();
    $('.picksCollapsible').collapsible();
  }
}

function renderTeam(data) {
  $('#teamOutput').append('<div class="col s12 m6 l4"><div class="card"><div class="card-content white-text"><span class="card-title">'+data.name+'</span><div id="'+data.teamId+'TradeGive"></div><div id="'+data.teamId+'TradeReceive"></div><div id="'+data.teamId+'CapInfo"></div><h5>Players:</h5><div id="'+data.teamId+'Players"></div><h5>Picks:</h5><ul class="collapsible picksCollapsible" data-collapsible="accordion" id="'+data.teamId+'Picks">'+outputPicks(data.picks, data.teamId)+'</ul><div id="'+data.teamId+'TradeExceptions"></div></div></div></div>')
  renderCapInfo(data);
}

// Render Cap Info
//
// // Add incoming and outgoing salary!!!
//
function renderCapInfo(dataInput) {
  $('#'+dataInput.teamId+'CapInfo').append('<p>Team Salary: '+dataInput.salaryTotals[0]+' Cap Space: '+(app.cap.salaryCap - dataInput.salaryTotals[0])+'</p>')
}


// Finish rendering
function renderTradeGive(data) {
  if (data.picksOut.length > 0 || data.playersOut.length > 0) {
    $('#'+data.teamData.teamId+'TradeGive').append('<div class="left-align"><h6>Trading Away:</h6><div id="'+data.teamData.teamId+'"></div></div>')
  }
  if (data.playersOut.length > 0) {

  }
  if (data.picksOut.length > 0) {

  }
}

function renderTradeReceive(data) {
  if (data.picksIn.length > 0 || data.playersIn.length > 0) {
    $('#'+data.teamData.teamId+'TradeReceive').append()
  }
  if (data.playersIn.length > 0) {

  }
  if (data.picksIn.length > 0) {

  }
}

// Render the Players
function renderPlayers(data) {
  $('#'+data[0].teamId+'Players').append('<ul class="collapsible playerCollapsible" data-collapsible="accordion">'+returnPlayers(data)+'</ul>')
}

function returnPlayers(playerArray) {
  var string = ' '
  for (var i = 0; i < playerArray.length; i++) {
    string = string + '<li><div class="collapsible-header">'+playerArray[i].name+' Salary: $'+playerArray[i].contract[0].salary+'</div><div class="collapsible-body"><p>Trade to: '+returnTeamsToTradeTo(playerArray[i])+'</p></div></li>'
  }
  return string
}

function returnTeamsToTradeTo(objectPlayer) {
  var string =''
  for (var i = 0; i < app.activeTeams.length; i++) {
    if (app.activeTeams[i].teamData.teamId != objectPlayer.teamId) {
      var newString = '<br><a class="waves-effect waves-white btn-flat" id="'+objectPlayer.playerId+'tradeTo'+app.activeTeams[i].teamData.teamId+'">'+app.activeTeams[i].teamData.name+'</a>'
      string = string + newString
    }
  }
  return string
}

// Render the Picks
function outputPicks(picksArray, teamID) {
  var string = ' ';
  for (var i = 0; i < picksArray.length; i++) {
    var string = string + '<li><div class="collapsible-header">'+picksArray[i].originalOwner+' '+picksArray[i].year+' '+returnRound(picksArray[i].round)+' round pick</div><div class="collapsible-body"><p>Description: '+picksArray[i].description+'<br>Trade to: '+returnTeamsToTradePicksTo(picksArray[i], teamID)+'</p></div</li>'
  }
  return string
}

function returnTeamsToTradePicksTo(objectPick, teamID) {
  var string =''
  for (var i = 0; i < app.activeTeams.length; i++) {
    if (app.activeTeams[i].teamData.teamId != teamID) {
      var newString = '<br><a class="waves-effect waves-white btn-flat" id="'+returnOwnerForID(objectPick.originalOwner)+objectPick.year+objectPick.round+'tradeTo'+app.activeTeams[i].teamData.teamId+'">'+app.activeTeams[i].teamData.name+'</a>'
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
