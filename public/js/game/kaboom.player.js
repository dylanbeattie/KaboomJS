/**
 * Created by JetBrains WebStorm.
 * User: dylanbeattie
 * Date: 04/06/2011
 * Time: 15:08
 * To change this template use File | Settings | File Templates.
 */

function KaboomPlayer(name) {
    /* Player.name must be unique and can be used to determine equality */
    this.name = name;
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
    velocity : new Velocity(0,0)
}

if (typeof exports == "object") {
	exports.KaboomPlayer = KaboomPlayer;
};