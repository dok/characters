var handler = function(req, res) {
  // console.log('i love pancakes', path.resolve(__dirname, '../client/index.html'));
  if(req.url === '/') {
    fs.readFile(path.resolve(__dirname, '../client/index.html'),
      function (err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
      }
    );
  }
};

var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var path = require('path');

var players = {};

app.listen(3000);

io.sockets.on('connection', function (socket) {
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