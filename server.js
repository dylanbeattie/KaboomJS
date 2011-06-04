var express = require('express');
 
var server = express.createServer(express.logger());

server.get('/', function(request, response) {
  response.send("There's supposed to be an earth-shattering kaboom...\n");
});

server.listen(process.env.PORT || 80);
