function KaboomSocket() {
	this.client = null;
	this.socket = null;
};

KaboomSocket.prototype = {
	init : function(client) {
		var that = this;
		this.client = client;
		this.socket = new io.Socket("localhost", {port: 5678, transports: ["websocket", "flashsocket"]});

		// EVENTS
		// connect, connecting, connect_failed, message, close,
		// disconnect, reconnect, reconnecting, reconnect_failed

		// WebSocket connection successful
		this.socket.on("connect", function() {
			console.log("Connected");
		});

		// WebSocket connection failed
		this.socket.on("connect_failed", function() {
			console.log("Connect failed");

		});

		// WebSocket disconnection
		this.socket.on("disconnect", function() {
			console.log("Disconnected");

		});

		// WebSocket message received
		this.socket.on("message", function(data) {
			that.receiveData(data);
		});

		this.socket.connect();
	},
	
	receiveData : function(data){		
		var msg = JSON.parse(data);
		
		console.log(msg);

		if (msg.type) {
			switch (msg.type) {
				case "welcome":
					this.client.gameSuccessfullyJoined(msg.game, msg.player);
					break;
				case "player_changed_direction":
					this.client.playerChangedDirection(msg.player);
					break;
			};
		};
	},
	
	join : function(){
		var msg = JSON.stringify({type: "join"});
		this.socket.send(msg);
	},
	
	playerChangedDirection : function(player) {
		var msg = JSON.stringify({type: "player_changed_direction", player: player});
		this.socket.send(msg);
	},
	
	playerDroppedBomb : function(player) {
		var msg = JSON.stringify({type: "player_dropped_bomb", player: player});
		this.socket.msg();
	},
	
	playerDied : function(player) {
		var msg = JSON.stringify({type: "player_died", player: player});
		this.socket.msg();
	}
	
};