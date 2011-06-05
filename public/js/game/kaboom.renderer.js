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
    var game = opts.game;
    this.itemImages = ["images/" + game.TILE_SIZE + "/solid-block.png",
        "images/" + game.TILE_SIZE + "/destroyable-block.png",
        "images/" + game.TILE_SIZE + "/blank.png" ];
    this.initialise = function() {
        var level = game.level;

        // create tiles
        for (var row = 0; row < level.rows.length; row++) {
            var rowDiv = $('<div class="row" style="position:absolute;top:' + row * game.TILE_SIZE + 'px;height:' + game.TILE_SIZE + 'px;width:' + game.TILE_SIZE * level.rows[row].length + 'px" />');

            for (var tileIndex = 0; tileIndex < level.rows[row].length; tileIndex++) {
                var tile = level.rows[row][tileIndex];
                var tileDiv = $('<div id="tile_' + row + '_' + tileIndex + '" class="tile" style="position:absolute;height:' + game.TILE_SIZE + 'px;width:' + game.TILE_SIZE + 'px;top:0;left:' + tileIndex * game.TILE_SIZE + 'px" />');

                if (tile != null) {
                    tileDiv.css('background', 'url(' + this.itemImages[tile.tileType] + ')');
                }

                rowDiv.append(tileDiv);
            }

            opts.arena.append(rowDiv);
        }

        // create players
        for (var player = 0; player < game.players.length; player++) {
            this.createPlayer(player + 1);
        }
    };

    this.createPlayer = function(num) {
        var playerDiv = $('<div id="player_' + num + '" class="player" />');

        opts.holding.append(playerDiv);
    };

    this.updatePlayerLocations = function() {
        for (var i = 0; i < game.players.length; i++) {
            var player = game.players[i];

            if (player != null) {
                if (opts.showBoundingBoxes) {
                    player.showBoundingBox(opts.playerLayer, game);
                }

                var playerDiv = $('#player_' + (i + 1));

                if (!playerDiv.data('isInPlay')) {
                    opts.playerLayer.append(playerDiv);
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
                }
            }
        }
    };

    this.updateItems = function() {
        for (var rowIndex = 0; rowIndex < game.level.rows.length; rowIndex++) {
            for (var tileIndex = 0; tileIndex < game.level.rows[rowIndex].length; tileIndex++) {
                var tile = game.level.rows[rowIndex][tileIndex];
                var tileDiv = $('#tile_' + rowIndex + '_' + tileIndex);

                var url = null;

                if (tile == null) {
                    url = 'url(images/blank.png)';
                } else {
                    url = 'url(' + this.itemImages[tile.tileType] + ')';
                }

                if (tileDiv.data('background') != url) {
                    tileDiv.css('background', url);
                    tileDiv.data('background', url);
                }

                if (opts.showBoundingBoxes) {
                    tile.showBoundingBox(opts.playerLayer, game);
                }
            }
        }
    };

    this.update = function() {
        this.updatePlayerLocations();
        this.updateItems();
    };

    this.initialise();
}
