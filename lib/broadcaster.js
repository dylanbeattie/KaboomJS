var _            = require('base');
var sys          = require('sys');
var EventEmitter = require('events').EventEmitter;

var Broadcaster = function(){
  var self = this;
  this.clients = {};
  
  function broadcast(message, fromJSON) {
    message = fromJSON ? JSON.stringify(message) : message;
    for(var id in self.clients) {
      self.clients[id].send(message);
    }
  }

  this.on('broadcast-json', function(message){
    broadcast(message, true);
  });

  this.on('broadcast', function(msg){ broadcast(msg) });

  EventEmitter.call(this);
}

sys.inherits(Broadcaster, EventEmitter);

Broadcaster.prototype.addClient = function(c) {
  var uuid  = _.uuid();
  c._kaboomUid = uuid;
  this.clients[uuid] = c;
}

Broadcaster.prototype.removeClient = function(c) {
  var self = this;
  return function() {
    delete self.clients[c._kaboomUid];
  }
}
 
var broadcaster = new Broadcaster();
exports.broadcaster = broadcaster
