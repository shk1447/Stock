var socket_io = require('socket.io');
var WebSocket = require('ws');
var requireDirectory = require('require-directory');
var modules = requireDirectory(module, './modules');
var request = require('request');

module.exports = function (httpServer, config) {
  var io = socket_io.listen(httpServer, { 'destroy buffer size': Infinity });
  io.sockets.on('connection', function(socket){
    var ws = new WebSocket(config.url.wsUrl);
    ws.binaryType = "arraybuffer";
    ws.on('open', function() {
      socket.emit('connected', 'ok');
    });
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
        if(data.protocol && data.protocol == "http") {
          var options = {
            url: config.url.httpUrl + '/' + data.target + '/' + data.method,
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(data.parameters)
          };

          request(options, function(err, res, body) {
            var result = JSON.parse(body);
            var msg = JSON.parse(result.message);
            socket.emit(data.target + "." + data.method, msg);
          });
        } else {
          ws.send(sendData);
        }
      } catch (error) {
        console.log(error);
      }
    });
    socket.on('disconnect', function(){
      ws.close();
    })
  })
};