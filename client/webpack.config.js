require('dotenv').config({path: '../.env'});

const cleanWebpackPlugin = require('clean-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');

const {
    MODE,
    PORT
} = process.env;

module.exports = {
    entry: './src/index.js',
    devServer: {
        historyApiFallback: true,
        port: parseInt(PORT) + 1,
        proxy: {
            '/api': 'http://localhost:3000'
        },
        watchContentBase: true
    },
    mode: MODE ? MODE : 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    performance: {
        hints: false,
    },
    plugins: [
        new htmlWebpackPlugin({
            template: './src/index.html'
        }),
        new cleanWebpackPlugin()
    ]
};
