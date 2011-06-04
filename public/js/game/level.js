function Level () {
	this.rows = 13;
	this.cols = 17;
	this.tileSize = 48;

    this.pixelToTiles = function (x,y) {
        /* TODO: translate a pixel location into tile co-ordinates */
    }
	
	this.rows = [];
	
	this.parseLevel = function(file) {
		var r, c;
		var entry;
		var index;
		var itemImages = [ 	"images/solid-block.png", 
							"images/destroyable-block.png",
							"images/blank.png" ];
		var spawn, spawnNum = 0;
		var solid, itemImage;
		
		var row = [];
		for (r = 0; r < file.length; r++) {
			entry = file[r];
			switch (entry) {
				case "\n":
					this.rows.push(row);
					row = [];
					continue;
				case "*":
					itemImage = itemImages[0];
					solid = true;
					spawn = false;
					break;
				case "-":
					itemImage = itemImages[1];
					solid = true;
					spawn = false
					break;
				case " ":
					itemImage = itemImages[2];
					solid = false;
					spawn = false;
					break;
				case "1":
					itemImage = itemImages[2];
					solid = false;
					spawn = true;
					spawnNum = 1;
					break;
				case "2":
					itemImage = itemImages[2];
					solid = false;
					spawn = true;
					spawnNum = 2;
					break;
				case "3":
					itemImage = itemImages[2];
					solid = false;
					spawn = true;
					spawnNum = 3;
					break;
				case "4":
					itemImage = itemImages[2];
					solid = false;
					spawn = true;
					spawnNum = 4;
					break;
					
			}
			var item = new Item(solid, itemImage);
			var tile = new Tile(this.tileSize, this.tileSize, item, spawn, spawnNum);
			row.push(tile);
			
		}
		
		this.rows.push(row);
	}
	
}

function Tile (height, width, item, spawn, spawnNum) {
	this.height = height;
	this.width = width;
	this.item = item;
	this.spawn = spawn;
	this.spawnNum = spawnNum;
}

function Item (solid, image) { // more shit to add
	this.solid = solid;
	this.image = image;
}