var express = require('express');
var path = require('path');
var configure = require('./configure');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var webpackDevMiddleware = require("webpack-dev-middleware");
var compiler = webpack(webpackConfig);
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

module.exports = function(config) {
    var app = express();

    app.use(express.static(path.resolve(__dirname, '../')));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.set('secret', 'dis');
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        hot: true,
        historyApiFallback: true,
        stats: {
            colors: true
        }
    }));

    app.use(session({
        key: 'dis',
        secret: '!@#$soul$#@!',
        rolling: true,
        resave: false,
        saveUninitialized: true
    })); 

    return app;
}; 