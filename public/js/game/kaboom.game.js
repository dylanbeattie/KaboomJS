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
        for (var i = 0; i < this.players.length; i++) {
          if (this.players[i] == null) {
            continue;
          }
          
          if (this.players[i].name === player.name || this.players[i].sessionId === player.sessionId) {
            return this.players[i];
          }
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
        var spawnPoint = null;
        
        for (var i = 0; i < this.players.length; i++) {
  	      if (this.players[i] && (this.players[i].name === player.name || this.players[i].sessionId === player.sessionId)) {
    	      spawnPoint = this.players[i].id;
    	      console.log(this.players[i].name+' left')
    	      this.players[i] = null;
    	    }
    	  }
    	  
    	  if (spawnPoint) {
    	    this.level.releaseSpawnPoint(spawnPoint);
  	    }
    },

    createPlayer : function(sessionId) {
        var spawn = this.level.getFirstEmptySpawnPoint();
		    var that=this;
        if (spawn == null) return(null);
        var player = new KaboomPlayer(sessionId, spawn.number, "Player " + spawn.number, that.tilesToPixels(spawn.position));
		console.log(player);
        this.players[spawn.number - 1] = player;
		console.log(spawn.number, this.players);
		spawn.player = player;
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
		this.players.forEach(function(p, idx) {
			if (p != null) {
				var newPos = new Position(
					p.position.x + game.DISTANCE * p.velocity.dx,
					p.position.y + game.DISTANCE * p.velocity.dy
				);
				
				var playerRect = new Rectangle(newPos.y, newPos.x, 48, 48);
				var canMove = true;
				
				game.level.forEachIntersectingTile(playerRect, game, function(tile) {
				  if (tile.solid) {
				    canMove = false;
				  }
				});
				
				if (canMove) {
					p.position = newPos;
				}
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
        this.rows = that.rows.map(function(row) {
          return row.map(function(cell) {
            return new Tile(cell.solid, cell.tileType, cell.row, cell.col);
          });
        });
        this.spawns = that.spawns;
    }
  
  this.forEachIntersectingTile = function(rect, game, callback) {
    $(this.rows).each(function(ri, row) {
      $(row).each(function(ti, tile) {
        tile.isIntersecting = false;
        if (rect.intersects(tile.getBounds(game))) {
          tile.isIntersecting = true;
          callback(tile);
        }
      });
    });
  };

	this.parseLevel = function(tileMap) {
		var r, c;
		var entry;
		var index;
		var spawn, spawnNum = 0;
		var solid, tileType;

		var row = [];
    
    for (var i = 0; i < tileMap.length; i++) {
      var tileChar = tileMap[i];

      switch (tileChar) {
        case '\n':
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
      
      if (spawn) {
				this.spawns.push(new Spawn(spawnNum, row.length, this.rows.length));
			}
			
			row.push(new Tile(solid, tileType, this.rows.length, row.length));
    };

		if (row.length > 0) {
			this.rows.push(row);
		}
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
	
	this.releaseSpawnPoint = function(num) {
	  for (var i = 0; i < this.spawns.length; i++) {
	    if (this.spawns[i].number === num) {
	      this.spawns[i].player = null;
	    }
	  }
	}
}

function Tile (solid, tileType, row, col) {
	this.solid = solid;
	this.tileType = tileType;
	this.row = row;
	this.col = col;
  this.getBounds = function(game) {
    return new Rectangle(this.col * game.TILE_SIZE, this.row * game.TILE_SIZE, game.TILE_SIZE, game.TILE_SIZE);
  }
};

function Spawn (num, x, y) {
	this.number = num;
	this.position = new Position(x,y);
	this.player = null;
}

function Rectangle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.left = x;
  this.top = y;
  this.right = this.left + width;
  this.bottom = this.top + height;
  this.pointIntersects = function(point) {
    return point.x >= this.left && point.x < this.right &&
           point.y >= this.top  && point.y < this.bottom;
  };
  this.intersects = function(that) {
    return this.pointIntersects({x: that.top,    y: that.left})  ||
           this.pointIntersects({x: that.top,    y: that.right}) ||
           this.pointIntersects({x: that.bottom, y: that.left})  ||
           this.pointIntersects({x: that.bottom, y: that.right});
  };
};
