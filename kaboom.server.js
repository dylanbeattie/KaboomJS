
/* The Kaboom server handles the actual gameplay engine. */

var KaboomServer = function (express, socketIo) {
    this.express = express;
    this.socketIo = socketIo;
};

KaboomServer.prototype = {
    start : function(port) {
        var server = this.express.createServer(this.express.logger());
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
