
var KaboomServer = function (express) {
    this.express = express;
};

KaboomServer.prototype = {
    start : function(port) {
        var server = this.express.createServer(this.express.logger());
        server.listen(port);
    }
};


var createServer = function(express) {
    return(new KaboomServer(express));
};

if (typeof exports == "object") {
    exports.createServer = createServer;
}
