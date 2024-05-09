const path = require('path');
const webpack = require('../../webpack.build.js');
const config = webpack();

module.exports = () => ({
    ...config,
    output: {
        ...config.output,
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'find',
    },
});
