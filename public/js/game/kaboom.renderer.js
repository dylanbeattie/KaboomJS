function KaboomRenderer(target, game) {
	this.itemImages = ["images/solid-block.png", 
						"images/destroyable-block.png",
						"images/blank.png" ];
  this.initialise = function() {
    var level = game.level;
    
    // create tiles
    for (var row = 0; row < level.rows.length; row++) {
    	var rowDiv = $('<div class="row" style="position:absolute;top:'+row*game.tileSize+'px;height:'+game.tileSize+'px;width:'+game.tileSize*level.rows[row].length+'px" />');

    	for (var tileIndex = 0; tileIndex < level.rows[row].length; tileIndex++) {
    		var tile = level.rows[row][tileIndex];
    		var tileDiv = $('<div id="tile_' + row + '_' + tileIndex + '" class="tile" style="position:absolute;height:' + game.tileSize + 'px;width:'+game.tileSize+'px;top:0;left:'+tileIndex * game.tileSize+'px" />');

    		if (tile != null) {
  				tileDiv.css('background', 'url(' + this.itemImages[tile.tileType] + ')');
    		}

    		rowDiv.append(tileDiv);
    	}

    	target.arena.append(rowDiv);
    }
    
    // create players
    for (var player = 0; player < game.players.length; player++) {
      this.createPlayer(player + 1);
    }
  };
  
  this.createPlayer = function(num) {
    var playerDiv = $('<div id="player_' + num + '" class="player" />');
    
    target.holding.append(playerDiv);
  };
  
  this.updatePlayerLocations = function() {
    for (var i = 0; i < game.players.length; i++) {
      var player = game.players[i];
      
      if (player != null) {
        var playerDiv = $('#player_' + (i + 1));
      
        target.playerLayer.append(playerDiv);
        playerDiv.css({
          position: 'absolute',
          top: player.position.y + 'px',
          left: player.position.x + 'px'
        });
      }
    }
  };
  
  this.updateItems = function() {
    for (var rowIndex = 0; rowIndex < game.level.rows.length; rowIndex++) {
      for (var tileIndex = 0; tileIndex < game.level.rows[rowIndex].length; tileIndex++) {
        var tile = game.level.rows[rowIndex][tileIndex];
        var tileDiv = $('#tile_' + rowIndex + '_' + tileIndex);
        
        if (tile == null) {
          tileDiv.css('background', 'url(images/blank.png)');
        } else {
    			tileDiv.css('background', 'url(' + this.itemImages[tile.tileType] + ')');
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
