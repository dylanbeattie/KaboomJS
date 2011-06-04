function Renderer(target, level) {
  for (var row = 0; row < level.rows.length; row++) {
  	var rowDiv = $('<div class="row" style="position:absolute;top:'+row*level.tileSize+'px;height:'+level.tileSize+'px;width:'+level.tileSize*level.rows[row].length+'px" />');
	
  	for (var tileIndex = 0; tileIndex < level.rows[row].length; tileIndex++) {
  		var tile = level.rows[row][tileIndex];
  		var tileDiv = $('<div class="tile" style="position:absolute;height:' + tile.height + 'px;width:'+tile.width+'px;top:0;left:'+tileIndex * tile.width+'px" />');
		
  		console.log(tile.item);
		
  		if (tile.item != null) {
  			tileDiv.css('background', 'url(' + tile.item.image + ')');
  		}
		
  		rowDiv.append(tileDiv);
  	}
	
  	target.append(rowDiv);
  }
}