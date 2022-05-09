const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        main: './src/js/main.js',
        cart: {
            dependOn: 'main',
            import: './src/js/cart.js'
        },
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    devServer: {
        host: "127.0.0.1",
        port: 5001,
        hot: true,
        watchFiles: ["src/styles/*"]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html',
            inject: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './src/assets',
                    to: './assets'
                },
                {
                    from: './src/styles',
                    to: './styles'
                }
            ]
        })
    ]
}