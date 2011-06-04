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
	}
	
};