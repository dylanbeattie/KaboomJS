var socket,
	levelData;

$(function() {
	$("#join").click(function() {
		initSocket();
	});	
});
	
var initSocket = function() {
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
		var msg = JSON.parse(data);
		
		console.log(msg);
		
		if (msg.type) {
			switch (msg.type) {
				case "welcome":
					levelData = msg.level;
					break;
			};
		};
	});
	
	socket.connect();
};

playerChangeDirection() {
	var msg = JSON.stringify({type: "player_changed_direction", time: new Date().getTime()})
	socket.send()
};