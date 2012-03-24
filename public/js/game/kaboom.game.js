if (typeof require == "function") {
    var KaboomPlayer = require("./kaboom.player").KaboomPlayer;
    var Position = require("./kaboom.player").Position;
    var KaboomLevel = require("./kaboom.level").KaboomLevel;
}

var KaboomGame = function(levelMap) {
    this.level = new KaboomLevel(levelMap);
    this.players = [];
    this.DISTANCE = 5;
    this.TILE_SIZE = 48;
    this.COLLISION_RANGE = 1;
    this.DEFAULT_FUSE_TIME_MS = 5000;
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
        var spawn = this.level.freeSpawnPointWhenPlayerDisconnects(player);
        if (spawn && spawn.number) {
            this.players[spawn.number - 1] = null;
            return(spawn.number);
        }
        return(0);
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
    },

    playerCanDropBomb: function(player) {
        var bombs = this.level.findBombsByPlayer(player);
        if (bombs.length >= player.allowedBombs) {
            console.info("Cannot drop: player %d has %d bombs laid already; allowed %d", player.id, bombs.length, player.allowedBombs);
            return false;
        }
        if (!this.level.bombCanBeHere(player.position)) {
            console.info("Cannot drop: level says bomb cannot be here.");
            return false;
        }
        console.info("%d can drop bomb at %d,%d", player.id, player.position.x, player.position.y);
        return true;
    },

    playerDroppedBomb: function(player) {
        this.level.bombAt(player, this.DEFAULT_FUSE_TIME_MS, this.boom);
    },

    boom: function(bomb) {
        console.info("There was supposed to be an earth-shattering KABOOM!");
        console.info("EARTH-SHATTERING KABOOM! bomb from player %d", bomb.droppedBy.id);
    }
};

if (typeof exports == "object") {
    exports.KaboomGame = KaboomGame;
}
