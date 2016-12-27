var socket_io = require('socket.io');
var WebSocket = require('ws');
var requireDirectory = require('require-directory');
var modules = requireDirectory(module, './modules');

module.exports = function (httpServer, config) {
  var io = socket_io.listen(httpServer, { 'destroy buffer size': Infinity });
  io.sockets.on('connection', function(socket){
    socket.on('fromclient', function(data){
      try {
        var d = data;
        var sendData = JSON.stringify(data);
        var ws = new WebSocket(config.url.wsUrl);
        ws.binaryType = "arraybuffer";
        ws.on('open', function() {
          ws.send(sendData);
        });
        ws.on('message', function(message) {
          var msg;
          if(d.method == "download") {
            msg = message;
          } else {
            msg = JSON.parse(message);
          }
          modules[d.target][d.method](msg,d);
          
          if(d.broadcast) {
            io.sockets.emit(d.target + "." + d.method, msg);
          } else {
            socket.emit(d.target + "." + d.method, msg);
          }
          
          ws.close();
        }); 
      } catch (error) {
        console.log(error);
      }
    })
  });
};