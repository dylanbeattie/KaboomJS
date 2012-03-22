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

var config = JSON.parse(configJSON.toString());

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
  socket.on("message", function(data) {
    console.log("Message from: %s", data);
    var msg = JSON.parse(data);
    if (msg.type) {
      console.log("Message type is: %s", msg.type);
      switch (msg.type) {
      case "join":
        var player = runningGame.createPlayer();
        if (!player) {
          msg = JSON.stringify({
            type: "game_full"
          });
          socket.send(msg);
          return;
        };
        var welcomeMessage = JSON.stringify({
          type: "welcome",
          gameState: runningGame,
          playerState: player
        });
        socket.send(welcomeMessage);
        break;
      default:
        socket.send(data);
        break;
      };
    };
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
