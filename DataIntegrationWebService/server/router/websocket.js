var socket_io = require('socket.io');
var WebSocket = require('ws');
var requireDirectory = require('require-directory');
var modules = requireDirectory(module, './modules');

module.exports = function (httpServer, config) {
  var io = socket_io.listen(httpServer, { 'destroy buffer size': Infinity });
  io.sockets.on('connection', function(socket){
    var ws = new WebSocket(config.url.wsUrl);
    ws.binaryType = "arraybuffer";
    ws.on('open', function() { });
    ws.on('message', function(message) {
      var d = JSON.parse(message);
      var msg = JSON.parse(d.result);
      
      modules[d.target][d.method](msg,d);
      
      if(d.broadcast) {
        io.sockets.emit(d.target + "." + d.method, msg);
      } else {
        socket.emit(d.target + "." + d.method, msg);
      }
    }); 

    socket.on('fromclient', function(data){
      try {
        var sendData = JSON.stringify(data);
        ws.send(sendData);
      } catch (error) {
        console.log(error);
      }
    });
    socket.on('disconnect', function(){
      ws.close();
    })
  })
};