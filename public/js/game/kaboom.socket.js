function MockSocket() {
    this.client = null;
    this.levelMap = ""
            + "*****************\n"
            + "*1 *           4*\n"
            + "*               *\n"
            + "*               *\n"
            + "*               *\n"
            + "*               *\n"
            + "*               *\n"
            + "*   *-* *-*     *\n"
            + "*               *\n"
            + "*               *\n"
            + "*               *\n"
            + "*****************";
}

MockSocket.prototype = {
    init : function(client) {
        this.client = client;
    },

    join : function() {
        var game = new KaboomGame(this.levelMap);
        var player = game.createPlayer();
        this.client.gameSuccessfullyJoined(game, player);
    },

    playerChangedDirection : function(player) {
    },

    playerDroppedBomb : function(player) {
    },

    playerDied : function(player) {
    }
}

function KaboomSocket() {
    this.client = null;
    this.socket = null;
}
;

KaboomSocket.prototype = {
    init : function(client, hostname, port) {
        var that = this;
        this.client = client;
        this.socket = io.connect(); // new io.Socket(hostname, {port: port, transports: ["websocket", "flashsocket"]});

        // EVENTS
        // connect, connecting, connect_failed, message, close,
        // disconnect, reconnect, reconnecting, reconnect_failed

        // WebSocket connection successful
        this.socket.on("connect", function() {
            console.log("Connected");
        });

        // WebSocket connection failed
        this.socket.on("connect_failed", function() {
            console.log("Connect failed");

        });

        // WebSocket disconnection
        this.socket.on("disconnect", function() {
            console.log("Disconnected");

        });

        // WebSocket message received
        this.socket.on("message", function(data) {
            that.receiveData(data);
        });

        //this.socket.connect();
    },

    receiveData : function(data) {
        var msg = JSON.parse(data);

        console.log(msg);

        if (msg.type) {
            switch (msg.type) {
                case "welcome":
                    this.client.gameSuccessfullyJoined(msg.gameState, msg.playerState);
                    break;
                case "player_changed_direction":
                    this.client.playerChangedDirection(msg.playerState);
                    break;
            }
        }
    },

    join : function() {
        var msg = JSON.stringify({type: "join"});
        console.log("Sending " + msg);
        this.socket.send(msg);
    },

    playerChangedDirection : function(player) {
        this.sendPlayerUpdate("player_changed_direction", player);
    },

    playerDroppedBomb : function(player) {
        this.sendPlayerUpdate("player_dropped_bomb", player);
    },

    playerDied : function(player) {
        this.sendPlayerUpdate("player_died", player);
    },

    sendPlayerUpdate : function(type, player) {
        var msg = JSON.stringify({type: type, player: player});
        console.log("Sending " + msg);
      this.socket.send(msg);
    }
};