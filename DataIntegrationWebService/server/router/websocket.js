var socket_io = require('socket.io');
var WebSocket = require('ws');
var requireDirectory = require('require-directory');
var modules = requireDirectory(module, './modules');

module.exports = function (httpServer, config) {
  var io = socket_io.listen(httpServer, { 'destroy buffer size': Infinity });
  io.sockets.on('connection', function(socket){
    socket.on('fromclient', function(data){
      var ws = new WebSocket(config.url.wsUrl);
      var sendData = JSON.stringify(data);
      ws.on('open', function() {
        ws.send(sendData);
      });
      ws.on('message', function(message) {
        var msg = JSON.parse(message);
        var target = msg.target.split('.');
        modules[target[0]][target[1]](msg.result);
        if(msg.broadcast) {
          io.sockets.emit(msg.target, msg.result);
        } else {
          socket.emit(msg.target, msg.result);
        }
        ws.close();
      });
    })
  });
};