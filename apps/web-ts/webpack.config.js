const path = require('path');
const commonConfig = require('shared/webpack.common.config')

const root = path.resolve(__dirname);
const tsLoader = {
    test: /\.(ts|tsx)$/i,
    exclude: ['/node_modules/'],
    use: [
        {
            loader: 'babel-loader',
        },
        {
            loader: 'ts-loader',
        },
    ],
};

const config = commonConfig({
    port: 3113,
    entry: `${root}/src/index.ts`,
    template: `${root}/index.html`,
});
config.module.rules.push(tsLoader);

config.output.path = path.resolve(__dirname, 'dist');
module.exports = config;
