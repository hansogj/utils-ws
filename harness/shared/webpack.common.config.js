
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const stylesHandler = 'style-loader';

const dependencies = require('./src/deps.json');

module.exports = ({ entry, port, template }) => {

    return {
        entry,
        output: {
            path: path.resolve(__dirname, 'dist'),
        },
        devtool: "source-map",
        devServer: {
            open: false,
            port,
            host: 'localhost',
        },
        plugins: [new HtmlWebpackPlugin({
            template,
            templateParameters: {
                dependencies: JSON.stringify(dependencies, null, 4)
            },

        })],
        mode: "development",
        module: {

            rules: [{
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
            ]

        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        }
    }
}
