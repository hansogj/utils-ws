// UMD output for the script-tag consumer in apps/web-js.
// Filename `maybe.js` preserved so the published 2.x path keeps working.
// ESM (`maybe.mjs`) + CJS (`maybe.cjs`) outputs are produced by vite (see
// vite.config.ts).
const path = require('path');
const webpack = require('../../webpack.build.js');
const config = webpack();

module.exports = () => ({
    ...config,
    entry: './src/maybe.ts',
    output: {
        ...config.output,
        path: path.resolve(__dirname, 'dist'),
        filename: 'maybe.js',
        library: 'maybe',
    },
});
