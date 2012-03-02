exports.testSomething = function(test){
    test.expect(1);
    test.ok(true, "this assertion should pass");
    test.done();
};

exports.testSomethingElse = function(test){
    test.ok(true, "this assertion should fail");
    test.done();
};

exports.server_reads_config_file = function(test) {
    var fs = require("fs");
    var kaboomServer = require("../kaboom.server").KaboomServer;
    var configFileWasRead = false;
    fs.readFileSync = function(file) {
        test.ok(file == "config.js", "Server should read config.js");
        configFileWasRead = true;
    };
    var kaboomServer = new kaboomServer(fs);
    test.ok(configFileWasRead, "Config file read OK!");

    test.done();
}