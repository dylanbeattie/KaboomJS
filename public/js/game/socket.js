function KaboomSocket() {
	this.socket = null;
};

KaboomSocket.prototype = {
	init : function() {
		this.socket = new io.Socket("localhost", {port: 5678, transports: ["websocket", "flashsocket"]});

		// EVENTS
		// connect, connecting, connect_failed, message, close,
		// disconnect, reconnect, reconnecting, reconnect_failed

		// WebSocket connection successful
		socket.on("connect", function() {
			console.log("Connected");
		});

		// WebSocket connection failed
		socket.on("connect_failed", function() {
			console.log("Connect failed");

		});

		// WebSocket disconnection
		socket.on("disconnect", function() {
			console.log("Disconnected");

		});

		// WebSocket message received
		socket.on("message", function(data) {
			that.receiveData(data);
		});

		socket.connect();
	},
	
	receiveData : function(data){		
		var msg = JSON.parse(data);

		if (msg.type) {
			switch (msg.type) {
				case "welcome":
					this.levelData = msg.level;
					break;
			};
		};
	},
	
	join : function(){
		var msg = JSON.stringify({type: "join"});
		socket.send(msg);
	},
	
	playerChangedDirection : function() {
		var msg = JSON.stringify({type: "player_changed_direction", player: this.player});
		socket.send(msg);
	},
	
	playerDroppedBomb : function() {
		var msg = JSON.stringify({type: "player_dropped_bomb", player: this.player});
		socket.msg();
	},
	
	playerDied : function() {
		var msg = JSON.stringify({type: "player_died", player: this.player});
		socket.msg();
	}
	
};