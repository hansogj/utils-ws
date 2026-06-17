// UMD output for the script-tag consumer in apps/web-js.
// Single entry: the package index includes the polyfill side-effects already,
// so the consumer only needs one <script> tag for full functionality.
// ESM + CJS outputs are produced by vite (see vite.config.ts).
const path = require('path');
const webpack = require('../../webpack.build.js');
const config = webpack();

module.exports = () => ({
    ...config,
    entry: './src/index.ts',
    output: {
        ...config.output,
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.umd.js',
        library: 'array.utils',
    },
});
