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
		
		
		/*
		setInterval(function(){
			game.update();
			that.draw(game);
		}, 1000/this.fps);
		*/		
		
		$(document).bind('keydown', this.onKeyDown.bind(this));
		$(document).bind('keyup', this.onKeyUp.bind(this));
		
    },


	onKeyDown : function(event){
		var player = window.player;
		
		var key = $.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
		
		var playerChanged = false;
		
		if (key == 'left') {
		    playerChanged = player.goLeft();
		}

		if (key == 'right') {
		    playerChanged = player.goRight();
		}

		if (key == 'up') {
			playerChanged = player.goUp();
		}

		if (key == 'down') {
		    playerChanged = player.goDown();
		}
		
	},

	onKeyUp : function(event){
		var player = window.player;
		var key = $.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();

		switch (key){
			case 'left':
			case 'right':
				player.horizontalStop();
				break
			case 'up':
			case 'down':
				player.verticalStop();
				break;
		}
	},
	
	notifyPlayerChanged: function(){
		this.socket.playerChangedDirection(player);
	},

	draw : function(){
		this.player.draw();
	},
	
	
	join: function(){
		console.log('Joining...');
		this.socket = new KaboomSocket();
		this.socket.init(this);
		this.socket.join();
		
	},
	
	gameSuccessfullyJoined : function(gameState, playerState){
		console.log('Creating game...');
		window.player = new KaboomPlayer();
		window.player.copyStateFrom(playerState);
		window.game = new KaboomGame();
		window.game.copyStateFrom(gameState);
	}
};


Function.prototype.bind = function () {

	if (arguments.length < 2 && arguments[0] === undefined) {
		return this;
	}

	var thisObj = this,

    args = Array.prototype.slice.call(arguments),

    obj = args.shift();

	return function () {
		return thisObj.apply(obj, args.concat(Array.prototype.slice.call(arguments)));
	};
};



Function.bind = function () {
	var args = Array.prototype.slice.call(arguments);
	return Function.prototype.bind.apply(args.shift(), args);
}

