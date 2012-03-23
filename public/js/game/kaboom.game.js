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
}

var KaboomGame = function(levelMap) {
    this.level = new KaboomLevel(levelMap);
    this.players = [];
    this.DISTANCE = 5;
    this.TILE_SIZE = 48;
    this.COLLISION_RANGE = 1;
};

KaboomGame.prototype = {

    copyStateFrom: function(gameState) {
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
    findPlayer: function(player) {
        console.log("finding player in %s", JSON.stringify(this.players));
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i] && this.players[i].name == player.name) {
                return (this.players[i]);
            }
        }
    },

    playerChangedVelocity: function(player) {
        /* TODO: find the GAME player matching the supplied player and
         update their position and velocity with those from the
         supplied player.
         */
    },

    addPlayer: function(player) {
        this.players.push(player);
        return (player);
    },

    removePlayer: function(player) {
        /* TODO: Find and free the player slot used by the specified player */
        /* TODO: remember to set the corresponding spawn point.player back to null */
    },

    createPlayer: function() {
        var spawn = this.level.getFirstEmptySpawnPoint();
        var that = this;
        if (spawn === null) return (null);
        var player = new KaboomPlayer(spawn.number, "Player " + spawn.number, that.tilesToPixels(spawn.position));
        console.log(player);
        this.players[spawn.number - 1] = player;
        console.log(spawn.number, this.players);
        spawn.player = player;
        return player;
    },

    tilesToPixels: function(position) {
        var pixelX = position.x * this.TILE_SIZE;
        var pixelY = position.y * this.TILE_SIZE;

        return new Position(pixelX, pixelY);
    },

    pixelsToTiles: function(position) {
        var tileX = Math.floor(position.x / this.TILE_SIZE);
        var tileY = Math.floor(position.y / this.TILE_SIZE);

        return new Position(tileX, tileY);
    },

    update: function() {
        var game = this;
        var tryMove = function(pos, delta, vel) {
                if (delta.y === 0 && delta.x === 0) return pos;

                var newPos = pos.translate(delta);
                var bbox = newPos.contract(4);
                var gridPos = {
                    topLeft: game.pixelsToTiles(newPos.topLeft),
                    topRight: game.pixelsToTiles(newPos.topRight),
                    bottomLeft: game.pixelsToTiles(newPos.bottomLeft),
                    bottomRight: game.pixelsToTiles(newPos.bottomRight)
                };
                var tileBlocking = function(tile) {
                        // this makes the player get stuck in the wall!
                        return tile.solid; // && tile.getBounds(game).intersects(newPos.contract(4));
                    };

                game.level.forEachTile(function(tile) {
                    tile.candidate = false;
                    tile.isIntersecting = false;
                });

                if (vel.dx == 1) {
                    // moving right
                    var tile1 = game.level.rows[gridPos.topRight.y][gridPos.topRight.x];
                    var tile2 = game.level.rows[gridPos.bottomRight.y][gridPos.bottomRight.x];
                    var tile1Bounds = tile1.getBounds(game);
                    var tile2Bounds = tile2.getBounds(game);

                    if (tileBlocking(tile1) && tileBlocking(tile2)) {
                        // both tiles ahead are solid, don't move
                        tile1.isIntersecting = true;
                        tile2.isIntersecting = true;
                        return pos;
                    }
                    if (tileBlocking(tile1)) {
                        // tile to the top right of us is solid but the one to the bottom right is not
                        // move down a bit
                        tile1.isIntersecting = true;
                        if (tile1Bounds.bottomLeft.y - bbox.y <= 18) {
                            return pos.translate({
                                x: delta.x,
                                y: game.DISTANCE
                            });
                        } else {
                            return pos;
                        }
                    }
                    if (tileBlocking(tile2)) {
                        // tile to the bottom right is solid, top right is not
                        // move up a bit
                        if (bbox.y - tile1Bounds.topLeft.y <= 18) {
                            return pos.translate({
                                x: delta.x,
                                y: -game.DISTANCE
                            });
                        } else {
                            return pos;
                        }
                    }
                } else if (vel.dx == -1) {
                    // moving left
                    var tile1 = game.level.rows[gridPos.topLeft.y][gridPos.topLeft.x];
                    var tile2 = game.level.rows[gridPos.bottomLeft.y][gridPos.bottomLeft.x];
                    var tile1Bounds = tile1.getBounds(game);
                    var tile2Bounds = tile2.getBounds(game);

                    if (tileBlocking(tile1) && tileBlocking(tile2)) {
                        // both tiles ahead are solid, don't move
                        tile1.isIntersecting = true;
                        tile2.isIntersecting = true;
                        return pos;
                    }
                    if (tileBlocking(tile1)) {
                        // tile to the top left of us is solid but the one to the bottom left is not
                        // move down a bit
                        tile1.isIntersecting = true;
                        if (tile1Bounds.bottomRight.y - bbox.y <= 18) {
                            return pos.translate({
                                x: delta.x,
                                y: game.DISTANCE
                            });
                        } else {
                            return pos;
                        }
                    }
                    if (tileBlocking(tile2)) {
                        // tile to the bottom left is solid, top left is not
                        // move up a bit
                        tile2.isIntersecting = true;
                        if (bbox.y - tile1Bounds.topRight.y <= 18) {
                            return pos.translate({
                                x: delta.x,
                                y: -game.DISTANCE
                            });
                        } else {
                            return pos;
                        }
                    }
                }

                if (vel.dy == 1) {
                    // moving down
                    var tile1 = game.level.rows[gridPos.bottomLeft.y][gridPos.bottomLeft.x];
                    var tile2 = game.level.rows[gridPos.bottomRight.y][gridPos.bottomRight.x];
                    var tile1Bounds = tile1.getBounds(game);
                    var tile2Bounds = tile2.getBounds(game);

                    if (tileBlocking(tile1) && tileBlocking(tile2)) {
                        // both tiles ahead are solid, don't move
                        tile1.isIntersecting = true;
                        tile2.isIntersecting = true;
                        return pos;
                    }
                    if (tileBlocking(tile1)) {
                        // tile to the bottom left of us is solid but the one to the bottom right is not
                        // move right a bit
                        tile1.isIntersecting = true;
                        if (tile1Bounds.topRight.x - bbox.x <= 18) {
                            return pos.translate({
                                x: game.DISTANCE,
                                y: delta.y
                            });
                        } else {
                            return pos;
                        }
                    }
                    if (tileBlocking(tile2)) {
                        // tile to the bottom right is solid, bottom left is not
                        // move left a bit
                        tile2.isIntersecting = true;
                        if (bbox.x - tile1Bounds.topLeft.x <= 18) {
                            return pos.translate({
                                x: -game.DISTANCE,
                                y: delta.y
                            });
                        } else {
                            return pos;
                        }
                    }
                } else if (vel.dy == -1) {
                    // moving up
                    var tile1 = game.level.rows[gridPos.topLeft.y][gridPos.topLeft.x];
                    var tile2 = game.level.rows[gridPos.topRight.y][gridPos.topRight.x];
                    var tile1Bounds = tile1.getBounds(game);
                    var tile2Bounds = tile2.getBounds(game);

                    if (tileBlocking(tile1) && tileBlocking(tile2)) {
                        // both tiles ahead are solid, don't move
                        tile1.isIntersecting = true;
                        tile2.isIntersecting = true;
                        return pos;
                    }
                    if (tileBlocking(tile1)) {
                        // tile to the top left of us is solid but the one to the top right is not
                        // move right a bit
                        tile1.isIntersecting = true;
                        if (tile1Bounds.bottomRight.x - bbox.x <= 18) {
                            return pos.translate({
                                x: game.DISTANCE,
                                y: delta.y
                            });
                        } else {
                            return pos;
                        }
                        return pos.translate({
                            x: 1,
                            y: vel.dy
                        });
                    }
                    if (tileBlocking(tile2)) {
                        // tile to the top right is solid, top left is not
                        // move left a bit
                        tile2.isIntersecting = true;
                        if (bbox.x - tile1Bounds.bottomLeft.x <= 18) {
                            return pos.translate({
                                x: -game.DISTANCE,
                                y: delta.y
                            });
                        } else {
                            return pos;
                        }
                    }
                }

                return newPos;
            };

        this.players.forEach(function(p, idx) {
            if (!p) return;
            if (p.velocity.dx === 0 && p.velocity.dy === 0) return;

            var bounds = p.getBounds(game);

            bounds = tryMove(bounds, {
                x: game.DISTANCE * p.velocity.dx,
                y: 0
            }, p.velocity);
            bounds = tryMove(bounds, {
                x: 0,
                y: game.DISTANCE * p.velocity.dy
            }, p.velocity);

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
};

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
    };

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
                spawn = false;
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
            if (spawn.player === null) return (spawn);
        }
    };
}

function Tile(solid, tileType, row, col) {
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
}

function Rectangle(x, y, width, height) {
    this.x = this.left = x;
    this.y = this.top = y;
    this.width = width;
    this.height = height;
    this.right = this.left + width;
    this.bottom = this.top + height;
    this.topLeft = {
        x: this.left,
        y: this.top
    };
    this.topRight = {
        x: this.right,
        y: this.top
    };
    this.bottomLeft = {
        x: this.left,
        y: this.bottom
    };
    this.bottomRight = {
        x: this.right,
        y: this.bottom
    };
}

Rectangle.prototype = {
    pointIntersects: function(point) {
        return point.x >= this.left && point.x <= this.right && point.y >= this.top && point.y <= this.bottom;
    },

    intersects: function(that) {
        return this.pointIntersects(that.topLeft) || this.pointIntersects(that.topRight) || this.pointIntersects(that.bottomLeft) || this.pointIntersects(that.bottomRight);
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

        if (div === null) {
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
