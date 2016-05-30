var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: ['babel-polyfill',
        './src/index.js'
    ],
    output: {
        path: path.join(__dirname, 'js'),
        publicPath: '/',
        filename: 'game.js'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['es2015' ,"stage-0"]
                }
            }
        ]
    }
};