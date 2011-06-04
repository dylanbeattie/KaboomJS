function KaboomClient(config) {
    config = config || {};
    this.fps = config.fps || 30;
	this.player = null;
	this.levelData = null;
}

KaboomClient.prototype = {

    init: function() {
		var that = this;
		this.player = new Player("Player 1");
		
		
		setInterval(function(){
			that.update();
			that.draw();
		}, 1000/this.fps);
		
		
		socket = new io.Socket("localhost", {port: 5678, transports: ["websocket", "flashsocket"]});

		// EVENTS
		// connect, connecting, connect_failed, message, close,
		// disconnect, reconnect, reconnecting, reconnect_failed

		// WebSocket connection successful
		socket.on("connect", function() {
			console.log("Connected");
			var msg = JSON.stringify({type: "join"});
			socket.send(msg);
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
		
		
		if (!keydown.left || keydown.right)
			this.player.x = parseInt(data);
	},

	update : function(){
		  if (keydown.left) {
		    this.player.x -= 5;
		  }

		  if (keydown.right) {
		    this.player.x += 5;
		  }

		  if (keydown.up) {
		    this.player.y -= 5;
		  }

		  if (keydown.down) {
		    this.player.y += 5;
		  }

		if (this.player.x < 0) this.player.x = 0;
	},
	
	draw : function(){
		this.player.draw();
	},
	
	join : function(){
		//
	}

};




function Player(name){
	this.name = name;
	this.x = 0;
	this.y = 0;
}

Player.prototype = {
	draw : function(){
		console.log("x: " + this.x + " y:" +this.y);
	}
};