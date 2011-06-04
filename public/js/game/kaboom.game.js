/**
 * Created by JetBrains WebStorm.
 * User: dylanbeattie
 * Date: 04/06/2011
 * Time: 15:07
 * To change this template use File | Settings | File Templates.
 */

if (typeof require == "function") {
	var KaboomPlayer = require("./kaboom.player").KaboomPlayer;
	var Position = require("./kaboom.player").Position;
};

var KaboomGame = function (level) {
    this.level = level;
    this.players = [];
    this.DISTANCE = 5;
    this.TILE_SIZE = 48;
};

KaboomGame.prototype = {
    

    copyStateFrom : function(gameState) {
        this.DISTANCE = gameState.DISTANCE;
        this.TILE_SIZE = gameState.TILE_SIZE;
        if (this.level && gameState.level && this.level.copyStateFrom) {
            this.level.copyStateFrom(gameState.level);
        }
        for (var i = 0; i < gameState.players.length; i++) {
            this.findPlayer(gameState.players[i]).copyStateFrom(gameState.players[i]);
        }
    },

    /* Finds the player instance within THIS game representing the same player as the supplied player */
    findPlayer : function(player) {
        for(var i = 0; i < this.players; i++) {
            if (this.players[i].name == player.name) return(this.players[i]);
        }
    },

        playerChangedVelocity : function(player) {
            /* TODO: find the GAME player matching the supplied player and
               update their position and velocity with those from the
               supplied player.
                */
        },

    addPlayer : function(player) {
        /* TODO: find the first empty spawn point and put the supplied player in it. */
    },

    removePlayer: function(player) {
        /* TODO: Find and free the player slot used by the specified player */
        /* TODO: remember to set the corresponding spawn point.player back to null */
    },

    createPlayer : function() {
        //var spawn = level.getFirstEmptySpawnPoint();
		var that=this;
		var spawn = {
			position: new Position(0,0),
			number: 1
		};
		console.log(spawn);
        if (spawn == null) return(null);
        var player = new KaboomPlayer("Player " + spawn.number, that.tilesToPixels(spawn.position));
		console.log(player);
        return player;
    },

    tilesToPixels : function(position) {
        var pixelX = position.x * this.TILE_SIZE;
        var pixelY = position.y * this.TILE_SIZE;

        return new Position(pixelX, pixelY);
    },

    pixelsToTiles : function(position) {
        var tileX = Math.floor(position.x/this.TILE_SIZE);
        var tileY = Math.floor(position.y/this.TILE_SIZE);
        return new Position(tileX, tileY);
    },


    update: function() {
		var game = this;
		/* For each player, assume they have moved DISTANCE in their own velocity */
		this.players.forEach(function(p, idx)
		{
			if (p != null)
			{
				var newPos = new Position(
					p.position.x + game.DISTANCE * p.velocity.dx,
					p.position.y + game.DISTANCE * p.velocity.dy);
				var tilePos = game.pixelsToTiles(newPos);
				var tile = game.level.rows[tilePos.y][tilePos.x];
				console.log(tilePos);
				if (!tile.solid)
					p.position = newPos;
			}
		});
    }
};

if (typeof exports == "object") {
	exports.KaboomGame = KaboomGame;
};
