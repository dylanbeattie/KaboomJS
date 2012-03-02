/**
 * Created by JetBrains WebStorm.
 * User: dylan.beattie
 * Date: 02/03/12
 * Time: 01:20
 * To change this template use File | Settings | File Templates.
 */

var KaboomServer = function (express) {
    this.express = express;
};

KaboomServer.prototype = {
    start : function(port) {
        var server = this.express.createServer(this.express.logger());
        server.listen(port);
    }
}


var createServer = function(fileSystem) {
    return(new KaboomServer(fileSystem));
}

if (typeof exports == "object") {
    exports.createServer = createServer;
}
