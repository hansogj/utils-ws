// UMD output for the (theoretical) script-tag consumer.
// Filename `abonnement.js` preserved so the published 4.x path keeps working.
// ESM (`abonnement.mjs`) + CJS (`abonnement.cjs`) outputs come from vite (see
// vite.config.ts).
const path = require('path');
const webpack = require('../../webpack.build.js');
const config = webpack();

module.exports = () => ({
    ...config,
    entry: './src/abonnement.ts',
    output: {
        ...config.output,
        path: path.resolve(__dirname, 'dist'),
        filename: 'abonnement.js',
        library: 'abonnement',
    },
});
