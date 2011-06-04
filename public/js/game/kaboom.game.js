/**
 * Created by JetBrains WebStorm.
 * User: dylanbeattie
 * Date: 04/06/2011
 * Time: 15:07
 * To change this template use File | Settings | File Templates.
 */

if (typeof require == "function") {
	var KaboomPlayer = require("./kaboom.player").KaboomPlayer;
};

function KaboomGame(level) {
    this.level = level;
}

KaboomGame.prototype = {
     players : new Array(),
     playerChangedVelocity : function(player) {
         /* TODO: find the GAME player matching the supplied player and
            update their position and velocity with those from the
            supplied player.
             */
     },

	createPlayer : function() {
		return new KaboomPlayer("Testing");
	},

    addPlayer : function(player) {
        /* TODO: find the first empty spawn point and put the supplied player in it. */
    },

    removePlayer: function(player) {
        /* TODO: Find and free the player slot used by the specified player */
    },

    DISTANCE: 5,

    update: function() {
        /* TODO: For each player, assume they have moved DISTANCE in their own velocity
         * Update the player's position after checking for wall/bomb collisions, etc. */
    }
};

if (typeof exports == "object") {
	exports.KaboomGame = KaboomGame;
};