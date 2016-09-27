/**
 * Created by shkim on 2016-06-22.
 */
module.exports = [
    {
        test: /\.jsx$/,
        loader: 'babel',
        query: {
            presets: ['es2015', 'react']
        }
    },
    {
        test: /\.css$/,
        loader: "style-loader!css-loader?root=."
        // exclude: /node_modules/
    }
];