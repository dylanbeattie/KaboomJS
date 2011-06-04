var socket = new io.Socket("localhost", {port: 5678, transports: ["websocket", "flashsocket"]});

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
	
});