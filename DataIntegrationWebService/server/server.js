var cmd = require('commander');
var configure = require('./libs/configure');
var server = require('./libs/server.setting.js');
var http = require('http');
var websocket = require('./router/websocket');
var config;
cmd
    .version('0.0.1')
    .option('-c, --conf [config]', 'set config file', './config/default.conf')
    .parse(process.argv);
try {
    if (cmd.conf) {
        config = configure.set(cmd).get();
        console.log(config);
    } else {
        config = configure.default;
    }
} catch (err) {
    console.log(err.message, err.stack);
    process.exit(1);
}

var app = server(config);
require('./router/api')(app);
var httpServer = http.createServer(app).listen(config.listen.port, config.listen.bind, function () {
    console.log('Server listening on http://'+ config.listen.bind +':'+ config.listen.port +', Ctrl+C to stop');
}).on('error', function(err) {
    console.log(err.message);
});

websocket(httpServer,config);