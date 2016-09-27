/**
 * Created by shkim on 2016-06-22.
 */

var path = require('path');
var webpack = require('webpack');
module.exports = {
    devtool: 'inline-source-map',
    entry: './client/index.jsx',
    output: {
        path: '/dist',
        publicPath:'/assets',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            _: 'lodash',
            $: 'jQuery',
            jQuery: 'jQuery',
            React : 'react',
            ReactDOM : 'react-dom'
        })
    ],
    externals: {

    },
    module: {
        loaders: require('./webpack.config.loader')
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};