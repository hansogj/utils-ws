# Changelog

All notable changes to `@hansogj/array.utils`. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project follows [Semantic Versioning](https://semver.org/).

Older history before the move into the `utils-ws` monorepo lives in git tags.

## [Unreleased]

### Removed
- **Breaking:** dropped the `flatMap` polyfill — `Array.prototype.flatMap` has been native since Node 11 / ES2019, so the `||` fallback never ran. The `./flatMap` sub-entry is gone; consumers importing it explicitly must drop the import. ([#46])

### Added
- JSDoc on `defined`, `definedList`, and the prototype extensions (`defined`, `allDefined`, `first`, `last`, `onEmpty`) — shows up in editor hover and published `.d.ts`. ([#47])

## [2.7.5] – 2026-06-13

### Changed
- Harmonized package shape across all workspace libraries: matching `exports` map, `sideEffects`, and filename convention (`.mjs` ESM, `.cjs` CJS, `.js` UMD). ([#41])

## [2.7.4] – earlier 2026

### Added
- Modernized packaging: `"type": "module"`, dual ESM/CJS exports via Vite, multi-entry UMD via webpack for the script-tag harness. ([#36])

[#36]: https://github.com/hansogj/utils-ws/pull/36
[#41]: https://github.com/hansogj/utils-ws/pull/41
[#46]: https://github.com/hansogj/utils-ws/pull/46
[#47]: https://github.com/hansogj/utils-ws/pull/47
