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

    this.rows = [];
    this.spawns = [];
    this.bombs = [];

    this.copyStateFrom = function(that) {
        this.rows = that.rows.map(function(row) {
            return row.map(function(cell) {
                return new Tile(cell.solid, cell.tileType, cell.row, cell.col);
            });
        });
        this.spawns = that.spawns;
        this.bombs = that.bombs;
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
    };

    if (initialTileMap) {
        this.parseLevel(initialTileMap);
    }

    this.getFirstEmptySpawnPoint = function() {
        for (var i = 0; i < this.spawns.length; i++) {
            var spawn = this.spawns[i];
            if (spawn.player === null) return (spawn);
        }
    };

    this.freeSpawnPointWhenPlayerDisconnects = function(player) {
        for (var i = 0; i < this.spawns.length; i++) {
            if (this.spawns[i].player && (this.spawns[i].player.id == player.id)) {
                this.spawns[i].player = null;
                return(this.spawns[i]);
            }
        }
        return(null);
    };

    this.findBombsByPlayer = function(player) {
        var found = [];
        for (var i=0; i<this.bombs.length; i++) {
            console.info("Checking %dth bomb (belongs to player %d)", i, this.bombs[i].droppedBy.id);
            if (this.bombs[i].droppedBy.id == player.id) {
                found.push(this.bombs[i]);
            }
        }
        console.info("player %d currently has %d bombs ticking", player.id, found.length);
        return found;
    },

    this.bombCanBeHere = function(position) {
        console.warn("TODO!");
        return true;
    };

    this.bombAt = function(player, fuseTimeMs, explosionCallback) {
        console.info("Player %d is placing bomb at %d,%d", player.id, player.position.x, player.position.y);
        var bomb = new KaboomBomb(new Position(player.position.x, player.position.y), fuseTimeMs, player, explosionCallback);
        this.bombs.push(bomb);
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

if (typeof exports == "object") {
    exports.KaboomLevel = KaboomLevel;
}
