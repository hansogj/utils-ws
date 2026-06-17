// UMD output for the script-tag consumer in apps/web-js.
// Multi-entry: web-js consumes packages as classic <script> tags with no
// module loader, so each sub-entry exposes its own window global (window.defined,
// window.onEmpty, etc.) in addition to window['array.utils'] for the umbrella.
// Filename suffix `.umd.js` is preserved so the ESM/CJS outputs from Vite
// (dist/{entry}.js, .cjs — see vite.config.ts) don't get overwritten.
const path = require('path');
const webpack = require('../../webpack.build.js');
const config = webpack();

module.exports = () => ({
    ...config,
    entry: {
        index: { import: './src/index.ts', filename: 'index.umd.js', library: { type: 'umd', name: 'array.utils' } },
        defined: { import: './src/defined/index.ts', filename: 'defined/index.umd.js', library: { type: 'umd', name: 'defined' } },
        onEmpty: { import: './src/onEmpty/index.ts', filename: 'onEmpty/index.umd.js', library: { type: 'umd', name: 'onEmpty' } },
        flatMap: { import: './src/flatMap/index.ts', filename: 'flatMap/index.umd.js', library: { type: 'umd', name: 'flatMap' } },
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
