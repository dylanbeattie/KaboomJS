function KaboomRenderer(target, game) {
  this.initialise = function() {
    var level = game.level;
    
    // create tiles
    for (var row = 0; row < level.rows.length; row++) {
    	var rowDiv = $('<div class="row" style="position:absolute;top:'+row*level.tileSize+'px;height:'+level.tileSize+'px;width:'+level.tileSize*level.rows[row].length+'px" />');

    	for (var tileIndex = 0; tileIndex < level.rows[row].length; tileIndex++) {
    		var tile = level.rows[row][tileIndex];
    		var tileDiv = $('<div id="tile_' + row + '_' + tileIndex + '" class="tile" style="position:absolute;height:' + tile.height + 'px;width:'+tile.width+'px;top:0;left:'+tileIndex * tile.width+'px" />');

    		if (tile.item != null) {
    			tileDiv.css('background', 'url(' + tile.item.image + ')');
    		}

    		rowDiv.append(tileDiv);
    	}

    	target.arena.append(rowDiv);
    }
    
    // create players
    for (var player = 0; player < game.players.length; player++) {
      this.createPlayer(player + 1, target.playerLayer);
    }
  };
  
  this.createPlayer = function(num) {
    var playerDiv = $('<div id="player_' + num + '" class="player" />');
    
    target.playerLayer.append(playerDiv);
  };
  
  this.update = function() {
    
  };
  
  this.initialise();
}