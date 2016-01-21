var mongoose = require('mongoose');

var connectionString = "mongodb://localhost/nba";

mongoose.connect(connectionString);

mongoose.connection.on('connected', function () {
  console.log('Connection operational.');
});

mongoose.connection.on('error', function () {
  console.log('Error: ' + error);
});

mongoose.connection.on('disconnected', function () {
  console.log('Connection closed.');
});
