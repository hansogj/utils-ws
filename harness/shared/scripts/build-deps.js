#!/usr/bin/env node
/*
 * Single source of truth for the dependency/version map used by the harness apps.
 *
 * All entries are workspace packages: read version from `packages/<pkg>/package.json`.
 *
 * Output: harness/shared/src/deps.json — consumed by shared/src/index.js (the `versions` field)
 * and by shared/webpack.common.config.js (HtmlWebpackPlugin templateParameters).
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..', '..');

const workspacePackages = [
  '@hansogj/abonnement-js',
  '@hansogj/array.utils',
  '@hansogj/find-js',
  '@hansogj/maybe',
];

const readVersion = (pkgJsonPath, pkgName) => {
  if (!fs.existsSync(pkgJsonPath)) {
    throw new Error(`Cannot find package.json for ${pkgName} at ${pkgJsonPath}`);
  }
  const { version } = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  if (!version) throw new Error(`Missing version in ${pkgJsonPath}`);
  return version;
};

const deps = {};

for (const name of workspacePackages) {
  const dir = name.replace(/^@hansogj\//, '');
  deps[name] = readVersion(path.join(repoRoot, 'packages', dir, 'package.json'), name);
}

const outPath = path.resolve(__dirname, '..', 'src', 'deps.json');
fs.writeFileSync(outPath, JSON.stringify(deps, null, 2) + '\n');

console.log(`wrote ${path.relative(repoRoot, outPath)}:`);
for (const [k, v] of Object.entries(deps)) console.log(`  ${k}@${v}`);
