var express = require('express');
var io = require("socket.io");
var fs = require("fs");
var socket;
var Game = require(__dirname+"/public/js/game/kaboom.game").KaboomGame;
var Player = require(__dirname+"/public/js/game/kaboom.player").KaboomPlayer;

var runningGame;
var file = fs.readFileSync("data/level.txt", "binary");
runningGame = new Game(file);
console.log(runningGame);

try {
  var configJSON = fs.readFileSync(__dirname + '/server/config.json');
} catch(e) {
  console.error('config.json not found');
}

var config = JSON.parse(configJSON.toString());

 
var server = express.createServer(express.logger());

server.use(express.static(__dirname + '/public'));

server.get('/', function(request, response) {
	response.redirect('/index.html');
});

server.get('/level', function(request, response) {
	fs.readFile("data/level.txt", "binary", function(err, file)
		{
			response.send({"level":file});
		}
	);
});

server.listen(config.gameServer.port, config.gameServer.host);

console.log("Kaboom! web server running on " + config.gameServer.host + ":" + config.gameServer.port);

socket = io.listen(server);
setSocketHandlers();

function setSocketHandlers() {
	socket.on("connection", function(client) {
		client.on("message", function(data) {
			var msg = JSON.parse(data);
			if (msg.type) {
				switch (msg.type) {
					case "join":
						var player = runningGame.createPlayer();
						if (!player) {
							msg = JSON.stringify({type: "game_full"});
							client.send(msg);
							return;
						};

						var output = JSON.stringify({type: "welcome", gameState: runningGame, playerState: runningGame.createPlayer()});
						client.send(output);
						break;
				};
			};
		});
	});	
};

//back door to kaboom
var repl = require('repl');
var net = require('net');
net.createServer(function (connection) {
  connection.write("Kaboom Back Door go away\n");
  require('child_process').exec("uname -a", function (err, stdout, stderr) {
    connection.write(stdout + "\n");
    var context = repl.start("kaboom server> ", connection).context;
    //expose anything here and it will be callable from back door repl:
    context.socket = socket;
    context.server = server;
  });
}).listen(config.backDoor.port, config.backDoor.host);
