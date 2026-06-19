// UMD output for the script-tag consumer in apps/web-js.
// Multi-entry: web-js consumes packages as classic <script> tags with no
// module loader, so each sub-entry exposes its own window global (window.defined,
// window.onEmpty, etc.) in addition to window['array.utils'] for the umbrella.
//
// Filename convention harmonized across all libraries:
//   .mjs = ESM (vite), .cjs = CJS (vite), .js = UMD (here).
const path = require('path');
const webpack = require('../../webpack.build.js');
const config = webpack();

module.exports = () => ({
    ...config,
    entry: {
        index: { import: './src/index.ts', filename: 'index.js', library: { type: 'umd', name: 'array.utils' } },
        defined: { import: './src/defined/index.ts', filename: 'defined/index.js', library: { type: 'umd', name: 'defined' } },
        onEmpty: { import: './src/onEmpty/index.ts', filename: 'onEmpty/index.js', library: { type: 'umd', name: 'onEmpty' } },
    },
    output: {
        ...config.output,
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        // Polyfill modules (defined/polyfill.ts, onEmpty/onEmpty.ts) mutate
        // Array.prototype as a side-effect. In production mode webpack would
        // tree-shake them away because the side-effect can't be detected
        // statically — disable that pass for this package.
        sideEffects: false,
    },
});
