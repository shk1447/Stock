var io = require('socket.io-client');
function WebSocketClient() {
    console.log('시작??')
    var connected = false;
    var socket = io.connect();
    socket.on('connected', function() {
        console.log("ok????")
        connected = true;
    });
    return socket;
};

module.exports = WebSocketClient();