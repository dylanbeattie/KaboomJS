var http = require('http');
 
var server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("There's supposed to be an earth-shattering kaboom...\n");
});
 
server.listen(process.env.PORT || 80);
