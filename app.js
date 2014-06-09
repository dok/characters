var express = require('express');
var app = express();
var http = require('http');
var server = app.listen(3000);
var io = require('socket.io').listen(server);

var routes = require('./routes');

var fs = require('fs');
var path = require('path');

app.set('port', process.env.PORT || 3000);
var engines = require('consolidate');
app.engine('html', engines.hogan);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.render('index.html');
});

var players = {};

io.sockets.on('connection', function (socket) {
  socket.emit('loadAllPlayers', players);

  socket.on('changePos', function (player) {
    players[player.name] = player;
    io.sockets.emit('refreshPlayerPosition', player);
  });

  socket.on('newCharacter', function(newPlayer) {
    players[newPlayer.name] = newPlayer;
    io.sockets.emit('enterCharacter', newPlayer);
  });
});
