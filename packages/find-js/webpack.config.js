const path = require("path");
const webpack = require("../../webpack.build.js");
const config = webpack();


module.exports = () => ({
    ...config,
    entry: "./src/find.ts",
    output: {
        ...config.output,
        path: path.resolve(__dirname, "dist"),
        filename: 'find.js',
        library: 'find',
    }
});

