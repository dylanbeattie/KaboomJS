/***
 * Manages the interaction between the keyboard, renderer,
 * socket/IO library and game engine, when running KaboomJS
 * in a web browser.
 * @constructor
 * @param config the game configuration data.
 */
function KaboomClient(config) {
    config = config || {};
    this.gameLoopTick = Math.floor(1000 / (config.fps || 30));
    this.player = null;
    this.levelData = null;
    this.socket = null;
}

KaboomClient.prototype = {

    init: function() {},

    /**
     * Controls whether a key event is handled by Kaboom! or should be bubbled to the browser.
     *
     * @param {string} key The desired radius of the circle.
     * @return {Boolean} True if the key event should be bubbled; otherwise false.
     */

    sendKeyToBrowser: function(key) {
        return (key != 'up' && key != 'down' && key != 'left' && key != 'right' && key != 'space');
    },

    /***
     * Translate a user pressing a key into a Kaboom game action.
     * @param event the browser event raised when the key was depressed
     */
    onKeyDown: function(event) {
        if (!window.player) return (true);
        var key = $.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
        if (key == 'space') {
            this.playerDropsBomb(window.player);
        } else {
            var playerActuallyChanged = window.player.go(key);
            if (playerActuallyChanged) this.notifyPlayerChanged();
        }
        return (this.sendKeyToBrowser(key));
    },

    /***
     * Translate a user releasing a key into a Kaboom game action.
     * @param event the browser event raised when the key was released
     */
    onKeyUp: function(event) {
        if (!window.player) return (true);
        var key = $.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
        if (key != 'space') {
            window.player.stop(key);
            this.notifyPlayerChanged();
        }
        return (this.sendKeyToBrowser(key));
    },

    notifyPlayerChanged: function() {
        if (this.socket) {
            this.socket.playerChangedDirection(window.player);
        }
    },

    join: function() {
        console.log('Joining...');
        this.socket = new KaboomSocket();
        this.socket.init(this, window.location.hostname, window.location.port);
        this.socket.join();
    },

    /***
     * Inform the client that it has successfully joined a game of Kaboom.
     * @param gameState The current state of the game that we've just joined
     * @param playerState The player we're going to be controlling in this game.
     */
    gameSuccessfullyJoined: function(gameState, playerState) {
        console.log('Creating game...');
        window.game = new KaboomGame();
        window.game.copyStateFrom(gameState);

        window.player = window.game.findPlayer(playerState);
        window.renderer = new KaboomRenderer({
            arena: $('#arena'),
            playerLayer: $('#playerLayer'),
            holding: $('#holding'),
            game: game,
            showBoundingBoxes: window.location.search == '?boxes'
        });

        setInterval(function() {
            window.game.update();
            window.renderer.update();
        }, this.gameLoopTick);
    },

    /**
     * Inform this client that another player has just joined the game that's in progress
     * @param playerState The new player who has connected to the current game of Kaboom
     */
    playerJoined: function(playerState) {
        console.info("playerJoined: " + playerState);
        var newPlayer = new KaboomPlayer();
        newPlayer.copyStateFrom(playerState);
        window.game.addPlayer(newPlayer);
        window.renderer.createPlayer(newPlayer);
        console.info("after new player joined: " + JSON.stringify(window.game.players));
    },

    playerChangedDirection: function(playerState) {
        console.info("playerChangedDirection: " + JSON.stringify(playerState));
        var player = window.game.findPlayer(playerState);
        player.copyStateFrom(playerState);
    },

    playerDropsBomb: function(playerState) {
        if (window.game.playerCanDropBomb(playerState)) {
            window.game.playerDropBomb(playerState);
        }
    },

    playerDisconnected : function(playerState) {
        console.info("Player disconnected" + JSON.stringify(playerState));
        window.game.removePlayer(playerState);
        window.renderer.removePlayer(playerState);
    }
};

/***
 * Wraps this function in another, and locks its execution scope to the object specified as the first argument.
 */
Function.prototype.tie = function() {
    if (arguments.length < 2 && arguments[0] === undefined) return this;
    var thisObj = this,
        args = Array.prototype.slice.call(arguments),
        obj = args.shift();
    return function() {
        return thisObj.apply(obj, args.concat(Array.prototype.slice.call(arguments)));
    };
};

Function.tie = function() {
    var args = Array.prototype.slice.call(arguments);
    return Function.prototype.tie.apply(args.shift(), args);
};
