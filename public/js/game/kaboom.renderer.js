KaboomPlayer.prototype.showBoundingBox = function(layer, game) {
    var boundingBox = $('#player_' + this.id + '_boundingBox');
    if (boundingBox.length == 0) {
        boundingBox = $('<div id="player_' + this.id + '_boundingBox" class="boundingBox player" />');
        layer.append(boundingBox);
    }

    var bounds = this.getBounds(game);
    boundingBox.css({
        top: bounds.top + 'px',
        left: bounds.left + 'px',
        width: bounds.width + 'px',
        height: bounds.height + 'px'
    });
};

Tile.prototype.showBoundingBox = function(layer, game) {
    var boundingBox = $('#tile_' + this.row + 'x' + this.col + '_boundingBox');
    if (boundingBox.length == 0) {
        boundingBox = $('<div id="tile_' + this.row + 'x' + this.col + '_boundingBox" class="boundingBox" />');
        layer.append(boundingBox);
    }

    var bounds = this.getBounds(game);
    boundingBox.css({
        top: bounds.top + 'px',
        left: bounds.left + 'px',
        width: bounds.width + 'px',
        height: bounds.height + 'px'
    });

    if (this.isIntersecting) {
        boundingBox.addClass('intersecting');
    } else {
        boundingBox.removeClass('intersecting');
    }
};

function KaboomRenderer(opts) {
    this.opts = opts;
    this.tileClasses = ["solid", "destroyable", "blank"];
    this.initialise();
    var game = opts.game;
}

KaboomRenderer.prototype = {
    makeTileHtml : function(tile) {
        var game = this.opts.game;
        var tileHtmlId = 'tile_' + tile.row + '_' + tile.col;
        var tileCssClass = 'tile ' + this.tileClasses[tile.tileType];
        return('<div id="' + tileHtmlId + '" class="' + tileCssClass + '" style="top: ' + (tile.row * game.TILE_SIZE) + 'px;left:' + tile.col * game.TILE_SIZE + 'px;" />');
    },

    initialise : function() {
        var level = game.level;
        // create tiles
        for (var row = 0; row < level.rows.length; row++) {
            for (var tileIndex = 0; tileIndex < level.rows[row].length; tileIndex++) {
                var tile = level.rows[row][tileIndex];
                if (tile != null) this.opts.arena.append(this.makeTileHtml(tile));
            }
        }
        // create players
        for (var player = 0; player < game.players.length; player++) {
            this.createPlayer(player + 1);
        }
    },

    createPlayer : function(num) {
        var playerDiv = $('<div id="player_' + num + '" class="player" />');
        this.opts.holding.append(playerDiv);
    },

    updatePlayerLocations : function() {
        for (var i = 0; i < game.players.length; i++) {
            var player = game.players[i];

            if (player == null) continue;

            if (this.opts.showBoundingBoxes) player.showBoundingBox(this.opts.playerLayer, game);

            var playerDiv = $('#player_' + (i + 1));

            if (!playerDiv.data('isInPlay')) {
                this.opts.playerLayer.append(playerDiv);
                playerDiv.data('isInPlay', true);
            }

            if (playerDiv.data('y') != player.position.y && playerDiv.data('x') != player.position.x) {
                var y = player.position.y - 32;
                var x = player.position.x + 8;
                playerDiv.css({
                    position: 'absolute',
                    top: y + 'px',
                    left: x + 'px'
                });
                playerDiv.data('x', x);
                playerDiv.data('y', y);

                if (player.velocity != null) {
                    if (player.velocity.dx != 0 || player.velocity.dy != 0) {
                        if (player.velocity.dy > 0) {
                            playerDiv.css({background: 'url(images/walk-down-sprite.png)'});
                        } else if (player.velocity.dy < 0) {
                            playerDiv.css({background: 'url(images/walk-up-sprite.png)'});
                        } else if (player.velocity.dx < 0) {
                            playerDiv.css({background: 'url(images/walk-left-sprite.png)'});
                        } else if (player.velocity.dx > 0) {
                            playerDiv.css({background: 'url(images/walk-right-sprite.png)'});
                        }
                        playerDiv.sprite({fps: 2, no_of_frames: 2});
                    } else {
                        playerDiv.destroy();
                    }
                }
            }
        }
    },

    updateItems : function() {
        for (var rowIndex = 0; rowIndex < game.level.rows.length; rowIndex++) {
            for (var tileIndex = 0; tileIndex < game.level.rows[rowIndex].length; tileIndex++) {
                var tile = game.level.rows[rowIndex][tileIndex];
//                var tileDiv = $('#tile_' + rowIndex + '_' + tileIndex);

//                var url = null;
//
//                if (tile == null) {
//                    url = 'url(images/blank.png)';
//                } else {
//                    url = 'url(' + this.itemImages[tile.tileType] + ')';
//                }
//
//                if (tileDiv.data('background') != url) {
//                    tileDiv.data('background', url);
//                }

                if (this.opts.showBoundingBoxes) {
                    tile.showBoundingBox(this.opts.playerLayer, game);
                }
            }
        }
    },

    update : function() {
        this.updatePlayerLocations();
        this.updateItems();
    }
}

