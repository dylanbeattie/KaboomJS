/**
 * Created by JetBrains WebStorm.
 * User: dylanbeattie
 * Date: 04/06/2011
 * Time: 15:08
 * To change this template use File | Settings | File Templates.
 */

KaboomPlayer = function(name, position, velocity) {
    /* Player.name must be unique and can be used to determine equality */
    this.name = name;
    this.position = position || new Position(0,0);
    this.velocity = velocity || new Velocity(0,0);
}

function Position(x, y) {
    this.x = x;
    this.y = y;
}

function Velocity(dx, dy) {
    this.dx = dx;
    this.dy = dy;
}

KaboomPlayer.prototype = {
    position : new Position(0,0),
    velocity : new Velocity(0,0),
	
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
	}
	
	
}

