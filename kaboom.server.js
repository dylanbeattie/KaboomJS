/* The Kaboom server combines the gameplay engine and the web content server into a single module. */

var KaboomServer = function (express, socketIo) {
    this.express = express;
    this.socketIo = socketIo;
};

KaboomServer.prototype = {
    start : function(port) {
        var server = this.express.createServer(this.express.logger());
        server.use(express.static(__dirname + '/public'));
        server.get('/', function(request, response) { response.redirect('/index.html'); });

        server.listen(port);
        this.socket = this.socketIo.listen(server);
    }
};


var createServer = function(express, socketIo) {
    return(new KaboomServer(express, socketIo));
};

if (typeof exports == "object") {
    exports.createServer = createServer;
}
