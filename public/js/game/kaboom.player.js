/**
 * Created by JetBrains WebStorm.
 * User: dylanbeattie
 * Date: 04/06/2011
 * Time: 15:08
 * To change this template use File | Settings | File Templates.
 */

var KaboomPlayer = function(id, name, position, velocity) { 
    /* Player.name must be unique and can be used to determine equality */
    this.id = id;
    this.name = name;
    this.position = position || new Position(0, 0);
    this.velocity = velocity || new Velocity(0, 0);
    this.direction = "";
};

Position = function(x, y) {
    this.x = x;
    this.y = y;
};

function Velocity(dx, dy) {
    this.dx = dx;
    this.dy = dy;
};

KaboomPlayer.prototype = {

    go: function(whichWay) {
        switch (whichWay) {
        case 'left':
            return (this.goLeft());
        case 'right':
            return (this.goRight());
        case 'up':
            return (this.goUp());
        case 'down':
            return (this.goDown());
        }
    },
    stop: function(whichWay) {
        switch (whichWay) {
        case 'up':
        case 'down':
            this.verticalStop();
            this.updateDirection();
            break;
        case 'left':
        case 'right':
            this.horizontalStop();
            this.updateDirection();
            break;
        }
    },

    updateDirection: function() {
        var nsComponent, ewComponent;
        nsComponent = (this.velocity.dy < 0 ? "North" : (this.velocity.dy > 0 ? "South" : ""));
        ewComponent = (this.velocity.dx < 0 ? "West" : (this.velocity.dx > 0 ? "East" : ""));
        var direction = nsComponent + ewComponent;
        if (direction) this.direction = direction;
    },

    getDirection: function() {
        return (Direction[this.direction] || 0);
    },

    isMoving: function() {
        return (!(this.velocity.dx == 0 && this.velocity.dy == 0));
    },

    goLeft: function() {
        if (this.velocity.dx != -1) {
            this.velocity.dx = -1;
            this.updateDirection();
            return true;
        }
        return false;
    },

    goRight: function() {
        if (this.velocity.dx != 1) {
            this.velocity.dx = 1;
            this.updateDirection();
            return true;
        }
        return false;
    },

    goUp: function() {
        if (this.velocity.dy != -1) {
            this.velocity.dy = -1;
            this.updateDirection();
            return true;
        }
        return false;
    },

    goDown: function() {
        if (this.velocity.dy != 1) {
            this.velocity.dy = 1;
            this.updateDirection();
            return true;
        }
        return false;
    },

    horizontalStop: function() {
        this.velocity.dx = 0;
    },

    verticalStop: function() {
        this.velocity.dy = 0;
    },

    copyStateFrom: function(that) {
        this.id = that.id;
        this.name = that.name;
        this.position = new Position(that.position.x, that.position.y);
        this.velocity = new Velocity(that.velocity.dx, that.velocity.dy);
        return this;
    },

    getBounds: function(game) {
        return new Rectangle(this.position.x, this.position.y, game.TILE_SIZE, game.TILE_SIZE);
    }
};

if (typeof exports == "object") {
    exports.KaboomPlayer = KaboomPlayer;
    exports.Position = Position;
}
