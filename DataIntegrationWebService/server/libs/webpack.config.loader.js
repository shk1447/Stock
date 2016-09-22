/**
 * Created by shkim on 2016-06-22.
 */
module.exports = [
    {
        test: /\.jsx$/,
        loader: 'babel',
        query: {
            presets: ['react']
        }
    },
    {
        test: /raw!$/, loader: 'raw-loader', exclude: /node_modules/
    },
    {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader',
        exclude: /node_modules/
    },
    {test: /\.jpe?g$|\.gif$|\.png$/i, loader: 'file-loader'},
    { test: /\.eot/, loader: 'url-loader?limit=100000&mimetype=application/vnd.ms-fontobject' },
    { test: /\.woff2(\?\S*)?$/, loader: 'url-loader?limit=100000&mimetype=application/font-woff2' },
    { test: /\.woff/, loader: 'url-loader?limit=100000&mimetype=application/font-woff' },
    { test: /\.ttf/, loader: 'url-loader?limit=100000&mimetype=application/font-ttf' },
    { test: /\.svg/, loader: 'url-loader?limit=100000' },

    {
        test: /\.css$/,
        loader: "style-loader!css-loader?root=."
        // exclude: /node_modules/
    },
    {
        test: /\.less$/,
        loader: 'style!css!less'
    }
];