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
    this.level = new KaboomLevel(levelMap);
    this.players = [];
    this.DISTANCE = 5;
    this.TILE_SIZE = 48;
};

KaboomGame.prototype = {

    copyStateFrom : function(gameState) {
        this.DISTANCE = gameState.DISTANCE;
        this.TILE_SIZE = gameState.TILE_SIZE;
        this.level = this.level || new KaboomLevel();
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
        var that = this;
        if (spawn == null) return(null);
        var player = new KaboomPlayer(spawn.number, "Player " + spawn.number, that.tilesToPixels(spawn.position));
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
        var tileX = Math.floor(position.x / this.TILE_SIZE);
        var tileY = Math.floor(position.y / this.TILE_SIZE);

        return new Position(tileX, tileY);
    },


    update: function() {
        var game = this;
        var tryMove = function(pos, delta) {
            var newPos = pos.translate(delta);
            var chosen = newPos;
            
            game.level.forEachTile(function(tile) {
                var bounds = tile.getBounds(game);
                
                tile.candidate = false;
                tile.isIntersecting = false;

                if (bounds.intersects(newPos.contract(4))) {
                    if (tile.solid) {
                        tile.isIntersecting = true;
                        chosen = pos;
                        return;
                    }
                }
            });
            
            return chosen;
        };
        
        this.players.forEach(function(p, idx) {
            if (!p) return;
            if (p.velocity.dx == 0 && p.velocity.dy == 0) return;
            
            var bounds = p.getBounds(game);
            
            bounds = tryMove(bounds, { x: game.DISTANCE * p.velocity.dx, y: 0 });
            bounds = tryMove(bounds, { x: 0, y: game.DISTANCE * p.velocity.dy });
            
            p.position = bounds.topLeft;
        });
    }
};

if (typeof exports == "object") {
    exports.KaboomGame = KaboomGame;
}

TileType = {
    Solid: 0,
    Destroyable: 1,
    Blank: 2
};

Direction = {
    North: 0,
    NorthEast: 1,
    East: 2,
    SouthEast: 3,
    South: 4,
    SouthWest: 5,
    West: 6,
    NorthWest: 7
}

function KaboomLevel(initialTileMap) {

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
    
    this.forEachTile = function(callback) {
        for (var ri = 0; ri < this.rows.length; ri++) {
            for (var ti = 0; ti < this.rows[ri].length; ti++) {
                callback(this.rows[ri][ti]);
            }
        }
    },

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
        }
        if (row.length) this.rows.push(row);
    }


    if (initialTileMap) {
        this.parseLevel(initialTileMap);
    }

    this.getFirstEmptySpawnPoint = function() {
        for (var i = 0; i < this.spawns.length; i++) {
            var spawn = this.spawns[i];
            if (spawn.player == null) return(spawn);
        }
    }
}

function Tile (solid, tileType, row, col) {
    this.solid = solid;
    this.tileType = tileType;
    this.row = row;
    this.col = col;
}

Tile.prototype = {
    getBounds: function(game) {
        return new Rectangle(this.col * game.TILE_SIZE, this.row * game.TILE_SIZE, game.TILE_SIZE, game.TILE_SIZE);
    }
};

function Spawn(num, x, y) {
    this.number = num;
    this.position = new Position(x, y);
    this.player = null;
};

function Rectangle(x, y, width, height) {
    this.x = this.left = x;
    this.y = this.top = y;
    this.width = width;
    this.height = height;
    this.right = this.left + width;
    this.bottom = this.top + height;
    this.topLeft = { x: this.left, y: this.top };
    this.topRight = { x: this.right, y: this.top};
    this.bottomLeft = { x: this.left, y: this.bottom };
    this.bottomRight = { x: this.right, y: this.bottom};
};

Rectangle.prototype = {
    pointIntersects: function(point) {
        return point.x >= this.left && point.x <= this.right &&
               point.y >= this.top  && point.y <= this.bottom;
    },
    
    intersects: function(that) {
        return this.pointIntersects(that.topLeft)    ||
               this.pointIntersects(that.topRight)   ||
               this.pointIntersects(that.bottomLeft) ||
               this.pointIntersects(that.bottomRight);
    },
    
    translate: function(point) {
        return new Rectangle(this.x + point.x, this.y + point.y, this.width, this.height);
    },

    contract: function(amount) {
        return new Rectangle(this.x + amount, this.y + amount, this.width - (amount * 2), this.height - (amount * 2));
    },
    
    // debug function to display a rect on the screen as a green div
    drawToScreen: function() {
        var div = window.DEBUG_RECTANGLE || null;
        
        if (div == null) {
            div = window.DEBUG_RECTANGLE = $('<div style="background: rgba(0, 255, 0, 0.5)" />');
            $('#playerLayer').append(div);
        }
        
        div.css({
            position: 'absolute',
            top: this.top + 'px',
            left: this.left + 'px',
            width: this.width + 'px',
            height: this.height + 'px'
        });
    }
};
