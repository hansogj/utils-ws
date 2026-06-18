// UMD output for the script-tag consumer in apps/web-js.
// ESM (`index.mjs`) + CJS (`index.cjs`) come from vite (see vite.config.ts).
// Filename convention harmonized: .mjs = ESM, .cjs = CJS, .js = UMD.
const path = require('path');
const webpack = require('../../webpack.build.js');
const config = webpack();

module.exports = () => ({
    ...config,
    entry: './src/index.ts',
    output: {
        ...config.output,
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'find',
    },
});
