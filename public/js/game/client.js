function KaboomClient(config) {
    config = config || {};
    this.fps = config.fps || 30;
	this.player = null;
	this.levelData = null;
}

KaboomClient.prototype = {

    init: function() {
		var that = this;
//		this.player = new Player("Player 1");
		
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

	draw : function(){
		this.player.draw();
	},
	
	
	join: function(){
		this.socket = new KaboomSocket();
		this.socket.init(client);
		this.socket.join();
	},
	
	gameSuccessfullyJoined : function(player, game){
		window.player = player;
		window.game = game;
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