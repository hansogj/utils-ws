# Changelog

All notable changes to `@hansogj/find-js`. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project follows [Semantic Versioning](https://semver.org/).

Older history before the move into the `utils-ws` monorepo lives in git tags.

## [Unreleased]

### Added
- JSDoc with usage examples on the default export. ([#47])

## [6.7.5] – 2026-06-13

### Changed
- Harmonized package shape across all workspace libraries. ([#41])

## [6.7.4] – earlier 2026

### Added
- Modernized packaging: dual ESM (`.mjs`) + CJS (`.cjs`) exports via Vite, UMD (`.js`) for script-tag consumers, `"type": "module"`. ([#37])

[#37]: https://github.com/hansogj/utils-ws/pull/37
[#41]: https://github.com/hansogj/utils-ws/pull/41
[#47]: https://github.com/hansogj/utils-ws/pull/47
