var express = require('express');
var fs = require("fs");
 
var server = express.createServer(express.logger());

server.get('/', function(request, response) {
	response.send("There's supposed to be an earth-shattering kaboom...\n");
});

server.get('/level', function(request, response) {
	fs.readFile("level.txt", "binary", function(err, file)
		{
			response.send({"level":file});
		}
	);
});

server.listen(process.env.PORT || 80);
