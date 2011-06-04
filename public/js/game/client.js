function KaboomClient(config) {
    config = config || {};
    this.fps = config.fps || 30;
	this.player = null;
	this.levelData = null;
	this.socket = null;
}

KaboomClient.prototype = {

    init: function() {
		var that = this;
		//this.player = new Player("Player 1");
			
		//setInterval(function(){
		//	that.update();
		//	that.draw();
		//}, 1000/this.fps);
		
    },

	join : function() {
		this.socket = new KaboomSocket();
		this.socket.init(this);
		this.socket.join();
	},
	
	gameSuccessfullyJoined : function(game, player) {
		// Message recieved from socket after successfull game join
		console.log("Game successfully joined");
	}
	
};