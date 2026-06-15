const path = require('path');
const commonConfig = require("shared/webpack.common.config")
const root = path.resolve(__dirname)

const config = commonConfig({
    port: 4114,
    entry: `${root}/src/index.js`,
    template: `${root}/index.html`,
});
config.output.path = path.resolve(__dirname, 'dist');
module.exports = config;
