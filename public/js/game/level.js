TileType = {
	Solid: 0,
	Destroyable: 1,
	Blank: 2
};

Level = function () {
	/*this.rows = 13;
	this.cols = 17;*/

	this.rows = [];

	this.parseLevel = function(file) {
		var r, c;
		var entry;
		var index;
		var spawn, spawnNum = 0;
		var solid, tileType;
		
		var row = [];
		this.spawns = [];
		for (r = 0; r < file.length; r++) {
			entry = file[r];
			switch (entry) {
				case "\n":
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
			if (spawn)
			{
				this.spawns.push(new Spawn(spawnNum, row.length, this.rows.length));
			}
			var tile = new Tile(solid, tileType);
			row.push(tile);
		}
		
		if (row.length > 0)
			this.rows.push(row);
		console.log(this.spawns);
	}

	this.getFirstEmptySpawnPoint = function()
	{
		for(var i = 0; i < this.spawns.length; i++) {
			if (spawn.player == null) return(spawn);
		}
	}
}

function Tile (solid, tileType) { // more shit to add
	this.solid = solid;
	this.tileType = tileType;
}

function Spawn (num, x, y) {
	this.number = num;
	this.position = new Position(x,y);
	this.player = null;
}
