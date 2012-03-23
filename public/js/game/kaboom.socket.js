function MockSocket() {
    this.client = null;
    this.levelMap = "" + "*****************\n" + "*1 *           4*\n" + "*               *\n" + "*               *\n" + "*               *\n" + "*               *\n" + "*               *\n" + "*   *-* *-*     *\n" + "*               *\n" + "*               *\n" + "*               *\n" + "*****************";
}

MockSocket.prototype = {
    init: function(client) {
        this.client = client;
    },

    join: function() {
        var game = new KaboomGame(this.levelMap);
        var player = game.createPlayer();
        this.client.gameSuccessfullyJoined(game, player);
    },

    playerChangedDirection: function(player) {},

    playerDroppedBomb: function(player) {},

    playerDied: function(player) {}
}

function KaboomSocket() {
    this.client = null;
    this.socket = null;
};

KaboomSocket.prototype = {
    init: function(client, hostname, port) {
        var that = this;
        this.client = client;
        this.socket = io.connect();

        this.socket.on("connect", function() {
            console.info("Connected");
        });

        this.socket.on("connect_failed", function() {
            console.info("Connect failed");
        });

        this.socket.on("disconnect", function() {
            console.info("Disconnected");
        });

        this.socket.on("welcome_ack", function(data) {
            that.client.gameSuccessfullyJoined(data.gameState, data.playerState);
        });

        this.socket.on("player_joined", function(data) {
            that.client.playerJoined(data.playerState);
        });

        this.socket.on("player_changed_direction", function(data) {
            that.client.playerChangedDirection(data);
        });
        this.socket.on("player_disconnected", function(player) {
            that.client.playerDisconnected(player);
        });
    },

    join: function() {
        this.socket.emit("join", {});
    },

    playerChangedDirection: function(player) {
        this.socket.emit("player_changed_direction", player);
    },

    playerDroppedBomb: function(player) {
        this.socket.emit("player_dropped_bomb", player);
    },

    playerDied: function(player) {
        this.socket.emit("player_died", player);
    }
};
