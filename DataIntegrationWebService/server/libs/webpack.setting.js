var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var webpackDevMiddleware = require("webpack-dev-middleware");
var compiler = webpack(webpackConfig);

module.exports = function(server) {

};