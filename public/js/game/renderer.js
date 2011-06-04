function Renderer(target, game) {
	var itemImages = ["images/solid-block.png", 
						"images/destroyable-block.png",
						"images/blank.png" ];
	  for (var row = 0; row < game.level.rows.length; row++) {
  	var rowDiv = $('<div class="row" style="position:absolute;top:'+row*game.tileSize+'px;height:'+game.tileSize+'px;width:'+game.tileSize*game.level.rows[row].length+'px" />');
	
  	for (var tileIndex = 0; tileIndex < game.level.rows[row].length; tileIndex++) {
  		var tile = game.level.rows[row][tileIndex];
  		var tileDiv = $('<div class="tile" style="position:absolute;height:' + tile.height + 'px;width:'+tile.width+'px;top:0;left:'+tileIndex * tile.width+'px" />');
		
  		console.log(tile.item);
		
  		if (tile.item != null) {
  			tileDiv.css('background', 'url(' + itemImage[tile.tileType] + ')');
			alert(tileDiv);
  		}
		
  		rowDiv.append(tileDiv);
  	}
	
  	target.append(rowDiv);
  }
}
