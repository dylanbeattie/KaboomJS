//exports.testSomething = function(test){
//    test.expect(1);
//    test.ok(true, "this assertion should pass");
//    test.done();
//};
//
//exports.testSomethingElse = function(test){
//    test.ok(true, "this assertion should fail");
//    test.done();
//};
//
//exports.server_reads_config_file = function(test) {
//    var fs = require("fs");
//    var kaboom = require("../kaboom.server");
//    var configFileWasRead = false;
//    fs.readFileSync = function(file) {
//        test.ok(file == "config.js", "Server should read config.js");
//        configFileWasRead = true;
//    };
//
//    var kaboomServer = kaboom.createServer(fs);
//    test.ok(configFileWasRead, "Config file read OK!");
//
//    test.done();
//}

var expressMock, serverMock, kaboom;
module.exports = {
    setUp:function (callback) {
        kaboom = require("../kaboom.server");
        expressMock = require('express');
        expressMock.serverCreated = false;
        serverMock = {
            listen:function (port) {
                this.listeningOnPort = port;
            }
        }
        expressMock.createServer = function (logger) {
            this.serverCreated = true;
            return(serverMock);
        }

        callback();
    },
    tearDown:function (callback) {
        callback();
    },
    kaboom_server_calls_express_createServer:function (test) {
        var kaboomServer = kaboom.createServer(expressMock);
        kaboomServer.start();
        test.ok(expressMock.serverCreated, "Kaboom! server should start an express server");
        test.done();
    },


    kaboom_server_starts_listening_on_specified_port:function (test) {
        var kaboomServer = kaboom.createServer(expressMock);
        kaboomServer.start(1234);
        test.ok(serverMock.listeningOnPort == 1234, "Server should be started and listening on specified port");
        test.done();
    }


}