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

var KaboomGame = function (levelMap) {
    this.level = new Level(levelMap);
    this.players = [];
    this.DISTANCE = 5;
    this.TILE_SIZE = 48;
};

KaboomGame.prototype = {
   
    copyStateFrom : function(gameState) {
        this.DISTANCE = gameState.DISTANCE;
        this.TILE_SIZE = gameState.TILE_SIZE;
		this.level = this.level || new Level();
        this.level.copyStateFrom(gameState.level);
        for (var i = 0; i < gameState.players.length; i++) {
            var sourcePlayer = gameState.players[i];
            if (sourcePlayer) {
                var targetPlayer = this.findPlayer(gameState.players[i]) || this.addPlayer(new KaboomPlayer());
                targetPlayer.copyStateFrom(gameState.players[i]);
            }
        }
    },

    /* Finds the player instance within THIS game representing the same player as the supplied player */
    findPlayer : function(player) {
        for(var i = 0; i < this.players.length; i++) {
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
        this.players.push(player);
        return(player);
    },

    removePlayer: function(player) {
        /* TODO: Find and free the player slot used by the specified player */
        /* TODO: remember to set the corresponding spawn point.player back to null */
    },

    createPlayer : function() {
        var spawn = this.level.getFirstEmptySpawnPoint();
		var that=this;
        if (spawn == null) return(null);
        var player = new KaboomPlayer("Player " + spawn.number, that.tilesToPixels(spawn.position));
		console.log(player);
        this.players[spawn.number - 1] = player;
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
				/* hacky "looks right for the image we've got values */
				var width = 43;
				var height = 38;

				var newPos = new Position(
					p.position.x + game.DISTANCE * p.velocity.dx,
					p.position.y + game.DISTANCE * p.velocity.dy);

				function goodPos(position)
				{
					var tilePos = game.pixelsToTiles(position);
					var tile = game.level.rows[tilePos.y][tilePos.x];
					
					try {
						if (!tile.solid)
							return true;
						}
					catch (ex) {
					  console.log(tilePos);
					  return false;
					}
				}
				
				var rightPos = new Position(newPos.x + width, newPos.y);
				var downPos = new Position(newPos.x, newPos.y + height);
				if (goodPos(newPos) && goodPos(rightPos) && goodPos(downPos))
					p.position = newPos;
			}
		});
    }
};

if (typeof exports == "object") {
	exports.KaboomGame = KaboomGame;
};

TileType = {
	Solid: 0,
	Destroyable: 1,
	Blank: 2
};

function Level(initialTileMap) {

	/*this.rows = 13;
	this.cols = 17;*/

	this.rows = [];
    this.spawns = [];

    this.copyStateFrom = function(that) {
        this.rows = that.rows;
        this.spawns = that.spawns;
    }

	this.parseLevel = function(tileMap) {
		var r, c;
		var entry;
		var index;
		var spawn, spawnNum = 0;
		var solid, tileType;

		var row = [];

		for (r = 0; r < tileMap.length; r++) {
			entry = tileMap[r];
			switch (entry) {
				case "\n":
					this.rows.push(row);
					row = [];
					continue;
				case "*":
					tileType = TileType.Solid;
					solid = true;
					spawn = false;
					break;
				case "-":
					tileType = TileType.Destroyable;
					solid = true;
					spawn = false
					break;
				case " ":
					tileType = TileType.Blank;
					solid = false;
					spawn = false;
					break;
				case "1":
					tileType = TileType.Blank;
					solid = false;
					spawn = true;
					spawnNum = 1;
					break;
				case "2":
					tileType = TileType.Blank;
					solid = false;
					spawn = true;
					spawnNum = 2;
					break;
				case "3":
					tileType = TileType.Blank;
					solid = false;
					spawn = true;
					spawnNum = 3;
					break;
				case "4":
					tileType = TileType.Blank;
					solid = false;
					spawn = true;
					spawnNum = 4;
					break;
				default:
					console.log(entry);

			}
			if (spawn)
			{
				this.spawns.push(new Spawn(spawnNum, row.length, this.rows.length));
			}
			var tile = new Tile(solid, tileType);
			row.push(tile);
		}

		if (row.length > 0)
			this.rows.push(row);
		console.log(this.spawns);
	}


    if (initialTileMap) {
        this.parseLevel(initialTileMap);
    }
    
	this.getFirstEmptySpawnPoint = function()
	{
		for(var i = 0; i < this.spawns.length; i++) {
		  var spawn = this.spawns[i];
			if (spawn.player == null) return(spawn);
		}
	}
}

function Tile (solid, tileType) { // more shit to add
	this.solid = solid;
	this.tileType = tileType;
}

function Spawn (num, x, y) {
	this.number = num;
	this.position = new Position(x,y);
	this.player = null;
}
