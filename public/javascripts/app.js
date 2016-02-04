var app = {
  activeTeams: [],
  activePlayers: []
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

function outputTeamSelect() {
  var number = $(".collapsible").children().length
  $(".collapsible").append('<li><div class="collapsible-header">Team '+(number+1)+'</div><div class="collapsible-body row" id="team'+(number+1)+'">'+outputImage()+'</div></li>')
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

// function changeActiveTeam() {
//   var number = $(".collapsible").children().length
//   for (var i = 0; i < number; i++) {
//     $(".collapsible").children().eq(i).removeClass('active')
//   }
//   $(".collapsible").children().last().addClass('active')
// }

function clickTeams() {
  $('.collapsible').find('img').unbind()
  $('.collapsible').children().last().find('img').on('click', function() {
    // var number = $('#teamOutput').children().length
    var teamId = $(this).prop('id')
    $(this).addClass('selectedTeam')
    app.activeTeams.push(teamId)
    var teamData = findTeam(teamId)
    $('#teamOutput').append('<div class="col s12 m6 l4"><div class="card blue-grey darken-1"><div class="card-content white-text"><span class="card-title">'+teamData.name+'</span><h4>Players:</h4><div id="'+teamData.teamId+'Players"></div><h4>Picks:</h4><ul id="'+teamData.teamId+'Picks">'+outputPicks(teamData.picks)+'</ul></div><div class="card-action"></div></div></div>')
    var playersData = findPlayersOnTeam(teamData.players)
    $('#'+teamData.teamId+'Players').append('<ul>'+returnPlayers(playersData)+'</ul>')
    outputTeamSelect();
  });
  for (var i = 0; i < app.activeTeams.length; i++) {
    $('.collapsible').children().last().find('#'+app.activeTeams[i]).unbind()
    $('.collapsible').children().last().find('#'+app.activeTeams[i]).addClass('usedTeam')
  }
}

function findPlayersOnTeam(playersIdArray) {
  var returnArray = []
  for (var i = 0; i < playersIdArray.length; i++) {
    var playerObject = findPlayer(playersIdArray[i])
    returnArray.push(playerObject)
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

function returnPlayers(playerArray) {
  var string = ' '
  for (var i = 0; i < playerArray.length; i++) {
    string = string + '<li><strong>'+playerArray[i].name+'</strong> Salary: $'+playerArray[i].contract[0].salary+'</li>'
  }
  return string
}

function outputPicks(picksArray) {
  var string = ' ';
  for (var i = 0; i < picksArray.length; i++) {
    var string = string + '<li>Year: '+picksArray[i].year+', Round: '+picksArray[i].round+', Original Owner: '+picksArray[i].originalOwner+'</li>'
  }
  return string
}
