var express = require('express');
var fs = require("fs");
var routes = require("./routes");
var socket;
var Game = require(__dirname + "/public/js/game/kaboom.game").KaboomGame;
var Player = require(__dirname + "/public/js/game/kaboom.player").KaboomPlayer;

var runningGame;
var levelMap = fs.readFileSync("data/level.txt", "binary");
runningGame = new Game(levelMap);
console.log(runningGame);

try {
  var configJSON = fs.readFileSync(__dirname + '/server/config.json');
} catch (e) {
  console.error('config.json not found');
}

var config = JSON.parse(configJSON.toString());console.log("Hey there!");

var app = express.createServer();
app.configure(function() {
  app.use(express.logger());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }))
});
app.configure('production', function() {
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/level', routes.level);

app.listen(config.gameServer.port);

console.log("Kaboom! web server running on http://%s:%d in '%s' mode", config.gameServer.host, config.gameServer.port, app.settings.env);

var io = require("socket.io").listen(app);
io.sockets.on("connection", function(socket) {
  socket.on("join", function(data) {
    console.info("Rx join %s", JSON.stringify(data));
    var player = runningGame.createPlayer();
    if (!player) {
      socket.emit("game_full", {});
      return;
    }
    socket.player = player;
    var ack = {
      gameState: runningGame,
      playerState: player
    };
    socket.emit("welcome_ack", ack);
    socket.broadcast.emit("player_joined", ack);
  });

  socket.on("disconnect", function() {
    console.log("========= CLIENT DISCONNECTED ========");
    if (socket.player) {
      console.log("Player " + socket.player.id + " disconnected");
      runningGame.removePlayer(socket.player);
      socket.broadcast.emit("player_disconnected", socket.player);
    } else {
      console.log("Player was undefined, though... we don't know who left :(");
    }
  });

  socket.on("player_changed_direction", function(playerState) {
    console.info("Rx player_changed_direction: %s", JSON.stringify(playerState));
    var player = runningGame.findPlayer(playerState);
    if (!player) {
      return;
    }
    console.info("Found player %d, %s", player.id, JSON.stringify(player));
    player.copyStateFrom(playerState);
    socket.broadcast.emit("player_changed_direction", playerState);
  });
});

////back door to kaboom
//var repl = require('repl');
//var net = require('net');
//net.createServer(function (connection) {
//  connection.write("Kaboom Back Door go away\n");
//  require('child_process').exec("uname -a", function (err, stdout, stderr) {
//    connection.write(stdout + "\n");
//    var context = repl.start("kaboom server> ", connection).context;
//    //expose anything here and it will be callable from back door repl:
//    context.socket = socket;
//    context.server = app;
//  });
//}).listen(config.backDoor.port, config.backDoor.host);
