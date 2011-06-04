/**
 * Created by JetBrains WebStorm.
 * User: dylanbeattie
 * Date: 04/06/2011
 * Time: 15:08
 * To change this template use File | Settings | File Templates.
 */

var KaboomPlayer = function(name, position, velocity) {
    /* Player.name must be unique and can be used to determine equality */
    this.name = name;
    this.position = position || new Position(0,0);
    this.velocity = velocity || new Velocity(0,0);
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
	
	goLeft: function(){
		this.velocity.dx = -1;
	},
	
	goRight: function(){
		this.velocity.dx = 1;
	},
	
	goUp: function(){
		this.velocity.dy = -1;
	},
	
	goDown: function(){
		this.velocity.dy = 1;
	},
	
	horizontalStop: function(){
		this.velocity.dx = 0;
	},
	
	verticalStop: function(){
		this.velocity.dy = 0;
	},

    copyStateFrom : function(that) {
        this.name = that.name;
        this.position = new Position(that.position.x, that.position.y);
        this.velocity = new Velocity(that.velocity.dx, that.velocity.dy);
		return this;
    }
};

if (typeof exports == "object") {
	exports.KaboomPlayer = KaboomPlayer;
	exports.Position = Position;
};
