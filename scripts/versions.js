/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
const { execSync } = require('child_process');

const package = process.argv
    .slice(2)
    .shift()
    .replace(/\/?packages\/?/, '')
    .split('/')
    .join('');

const p = require(`${__dirname}/../packages/${package}/package.json`);
let publishedVersion;
try {
    publishedVersion = `published version ${execSync(`npm view ${p.name} version 2>&1`).toString().replace(/\n/, '')}`;
} catch (error) {
    publishedVersion = 'Not published';
}

console.log(`${p.name}:\t\t\t\t[local version: ${p.version},\t\t  ${publishedVersion}]`);
