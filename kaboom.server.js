/**
 * Created by JetBrains WebStorm.
 * User: dylan.beattie
 * Date: 02/03/12
 * Time: 01:20
 * To change this template use File | Settings | File Templates.
 */

var KaboomServer = function (fileSystem) {
    this.fileSystem = fileSystem;
    this.config = fileSystem.readFileSync("config.js");
};

KaboomServer.prototype = {

    helloWorld : function(foo, bar) {
        // This is how you add functions to an object in an exported JS library.
    }
}


if (typeof exports == "object") {
    exports.KaboomServer = KaboomServer;
}
