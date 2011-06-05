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
    },
    
    onKeyDown : function(event){
		var player = window.player;
		
		var key = $.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
		
		var playerChanged = false;
		var handled = false;
		
		if (key == 'left') {
			handled = true;
		    playerChanged = player.goLeft();
		}

		if (key == 'right') {
			handled = true;
		    playerChanged = player.goRight();
		}

		if (key == 'up') {
			handled = true;
			playerChanged = player.goUp();
		}

		if (key == 'down') {
			handled = true;
		    playerChanged = player.goDown();
		}
		
		if (playerChanged){
			this.notifyPlayerChanged();
		}
		
		return !handled;	
	},

	onKeyUp : function(event){
		var player = window.player;
		var key = $.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
		var handled = false;
		
		switch (key){
			case 'left':
			case 'right':
				handled = true;
				player.horizontalStop();
				break
			case 'up':
			case 'down':
				handled = true;
				player.verticalStop();
				break;
		}
		
		this.notifyPlayerChanged();
		return !handled;			
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
		this.socket.init(this, window.location.hostname, window.location.port);
		this.socket.join();
		
	},
	
	gameSuccessfullyJoined : function(gameState, playerState){
		console.log('Creating game...');
		window.game = new KaboomGame();
		window.game.copyStateFrom(gameState);
		
		window.player = window.game.findPlayer(playerState);
		$(document).bind('keydown', this.onKeyDown.tie(this));
		$(document).bind('keyup', this.onKeyUp.tie(this));

	  var renderer = new KaboomRenderer({
		  arena: $('#arena'),
		  playerLayer: $('#playerLayer'),
		  holding: $('#holding'),
		  game: game
		});

		setInterval(function(){
			window.game.update();
			renderer.update();
		}, 1000/this.fps);
	},
	
	playerJoined: function(playerState){
		var newPlayer = new KaboomPlayer();
		newPlayer.copyStateFrom(playerState);
		window.game.addPlayer(newPlayer);
	}
	
	
};


Function.prototype.tie = function () {

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



Function.tie = function () {
	var args = Array.prototype.slice.call(arguments);
	return Function.prototype.tie.apply(args.shift(), args);
}

