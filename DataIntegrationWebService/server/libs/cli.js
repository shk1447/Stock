var express = require('express');
var http = require('http');

var app = express();
app.server = http.createServer(app);

app.get('*', function(req,res) {
    console.log(req);
    console.log(res);
});

app.server.listen(8080, "0.0.0.0", function () {
    console.log('Server listening on http://0.0.0.0:8080, Ctrl+C to stop');
}).on('error', function(err) {
    console.log(err.message);
});