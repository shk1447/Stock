var socket_io = require('socket.io');
var WebSocket = require('ws');
var requireDirectory = require('require-directory');
var modules = requireDirectory(module, './modules');

module.exports = function (httpServer, config) {
  var io = socket_io.listen(httpServer, { 'destroy buffer size': Infinity });
  io.sockets.on('connection', function(socket){
    socket.on('fromclient', function(data){
      var d = data; 
      var ws = new WebSocket(config.url.wsUrl);
      var sendData = JSON.stringify(data);
      ws.binaryType = "arraybuffer";
      ws.on('open', function() {
        ws.send(sendData);
      });
      ws.on('message', function(message) {
        var msg;
        var target = d.target.split('.');
        if(target[1] == "download") {
          msg = message;
        } else {
          msg = JSON.parse(message);
        }
        modules[target[0]][target[1]](msg);
        
        if(d.broadcast) {
          io.sockets.emit(d.target, msg);
        } else {
          socket.emit(d.target, msg);
        }
        
        ws.close();
      });
    })
  });
};