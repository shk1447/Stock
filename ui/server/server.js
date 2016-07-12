/**
 * Created by shkim on 2016-06-22.
 */
var path = require('path');
var http = require('http');
var cmd = require('commander');
var express = require('express');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var webpackDevMiddleware = require("webpack-dev-middleware");
var compiler = webpack(webpackConfig);
var configure = require('./configure');
var requireDirectory = require('require-directory');
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
var app = express();
app.server = http.createServer(app);

app.use(express.static(path.resolve(__dirname, '../../node_modules')));
app.use(express.static(path.resolve(__dirname, '../../')));
app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {
        colors: true
    }
}));

require('./api/routes.js')(app);
require('./api/ddp.js')(app, config);
require('./api/mongoconn.js').setUrl(config);

app.server.listen(config.listen.port, config.listen.bind, function () {
    console.log('Server listening on http://'+ config.listen.bind +':'+ config.listen.port +', Ctrl+C to stop');
}).on('error', function(err) {
    console.log(err.message);
});