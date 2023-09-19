const path = require("path");
const webpack = require("../../webpack.build.js");
const config = webpack();

module.exports = () => ({
    ...config,
    entry: {
        defined: {
            import: './src/defined/index.ts', filename: './defined/index.js',
            library: { type: 'umd', name: 'defined' },
        },
        flatMap: {
            import: './src/flatMap/index.ts', filename: './flatMap/index.js',

        },
        onEmpty: { import: './src/onEmpty/index.ts', filename: './onEmpty/index.js' },
        index: { import: './src/index.ts', filename: './index.js' },
    },

    output: {
        ...config.output,
        path: path.resolve(__dirname, 'dist'),
        filename: "index.js",
        library: 'array.utils',

    }
});