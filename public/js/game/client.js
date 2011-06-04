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
		console.log('keydown');
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
		
		if (playerChanged)
			this.notifyPlayerChanged();
		return false;	
		
	},

	onKeyUp : function(event){
		console.log('keyup');
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
		
		this.notifyPlayerChanged();
		return false;
		
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
		window.game = new KaboomGame();
		window.game.copyStateFrom(gameState);
		
		window.player = window.game.findPlayer(playerState);
		$(document).bind('keydown', this.onKeyDown.tie(this));
		$(document).bind('keyup', this.onKeyUp.tie(this));

		var renderingTargets = {
		  arena: $('#arena'),
		  playerLayer: $('#playerLayer'),
		  holding: $('#holding')
		};
		
	  var renderer = new KaboomRenderer(renderingTargets, window.game);

		setInterval(function(){
			window.game.update();
			renderer.update();
		}, 1000/this.fps);


		
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

