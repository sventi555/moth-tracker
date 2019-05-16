require('dotenv').config();

const cleanWebpackPlugin = require('clean-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');

const {
    MODE,
} = process.env;

module.exports = {
    entry: './src/index.js',
    devServer: {
        compress: true,
        historyApiFallback: true,
        port: 3001,
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
    optimization: {
        minimize: true
    },
    plugins: [
        new htmlWebpackPlugin({
            template: './src/index.html'
        }),
        new cleanWebpackPlugin()
    ]
};
