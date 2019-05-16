module.exports = {
    entry: 'index.js',
    devServer: {
        compress: true,
        historyApiFallback: true,
        port: 3001,
        proxy: {
            '/api': 'http://localhost:3000'
        },
        watchContentBase: true
    }
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader"
                }
            }
        ]
    }
}
