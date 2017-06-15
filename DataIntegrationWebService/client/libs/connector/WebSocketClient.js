var io = require('socket.io-client');
var WebSocketClient = (function () {
    var connected = false;
    var socket = io.connect();
    socket.on('connected', function() {
        connected = true;
    });
    var instance = {
        socket : socket,
        register : function(path, func) {
            console.log(path);
        }
    };
    return instance;
})();

module.exports = WebSocketClient;