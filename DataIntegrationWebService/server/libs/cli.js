var express = require('express');
var app = express();
var router = require('../router/main')(app);
var path = require('path');

app.set('views', path.resolve(__dirname, '../../client'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.resolve(__dirname, '../../public')));

var server = app.listen(8080, "0.0.0.0", function () {
    console.log('Server listening on http://0.0.0.0:8080, Ctrl+C to stop');
}).on('error', function(err) {
    console.log(err.message);
});