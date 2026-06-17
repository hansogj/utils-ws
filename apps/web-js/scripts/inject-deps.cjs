#!/usr/bin/env node
// web-js has no bundler, so we do the `<%= dependencies %>` substitution
// in a tiny post-copy step. Mirrors what HtmlWebpackPlugin does for web-cs/ts.
const fs = require('fs');
const path = require('path');

const distHtml = path.resolve(__dirname, '..', 'dist', 'index.html');
const deps = require(path.resolve(__dirname, '..', '..', '..', 'harness', 'shared', 'src', 'deps.json'));

const html = fs.readFileSync(distHtml, 'utf8');
const out = html.replace(/<%=\s*dependencies\s*%>/g, JSON.stringify(deps, null, 4));
fs.writeFileSync(distHtml, out);
