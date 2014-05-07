var express = require('express');
var app = express();
var http = require('http');
// var server = http.createServer(app);
var server = app.listen(3000);
var io = require('socket.io').listen(server);

var routes = require('./routes');

var fs = require('fs');
var path = require('path');

app.set('port', process.env.PORT || 3000);
// app.set('views', path.join(__dirname, 'views'));
var engines = require('consolidate');
// app.engine('.html', require('jade'));
app.engine('html', engines.hogan);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.render('index.html');
});

// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });

var players = {};

io.sockets.on('connection', function (socket) {
  console.log('connection!');
  socket.emit('loadAllPlayers', players);

  socket.on('changePos', function (player) {
    console.log('changing position', player);
    players[player.name] = player;
    io.sockets.emit('refreshPlayerPosition', player);
  });

  socket.on('newCharacter', function(newPlayer) {
    console.log('new player has arrived! ', newPlayer.name);
    players[newPlayer.name] = newPlayer;
    console.log(players);
    io.sockets.emit('enterCharacter', newPlayer);
  });
});

// var defaultCorsHeaders = {
//   "access-control-allow-origin": "*",
//   "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "access-control-allow-headers": "content-type, accept",
//   "access-control-max-age": 10 // Seconds.
// };