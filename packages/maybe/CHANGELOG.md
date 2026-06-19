# Changelog

All notable changes to `@hansogj/maybe`. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project follows [Semantic Versioning](https://semver.org/).

Earlier history (pre-monorepo) lives in the original `@hansogj/maybe` repository's git tags.

## [Unreleased]

### Fixed
- `stringify` now preserves strings as-is and emits valid JSON for objects/arrays. The previous implementation ran `JSON.stringify(value).replace(/\"/g, '')`, which destroyed every double-quote in the output — mangling strings with internal quotes and producing invalid JSON for objects (`{a:[]}` instead of `{"a":[]}`). ([#45])

### Added
- JSDoc on the `Maybe` class, every instance/static method, the `maybe()` factory, and the `Optional<T>` alias. ([#47])

## [2.7.0] – 2026-03-28

### Changed
- Integrated into the `utils-ws` monorepo from the standalone `@hansogj/maybe` repository. ([#35])
- Modernized packaging: dual ESM (`.mjs`) + CJS (`.cjs`) exports via Vite, UMD (`.js`) for script-tag consumers. ([#38])
- Harmonized package shape with the rest of the workspace. ([#41])

[#35]: https://github.com/hansogj/utils-ws/pull/35
[#38]: https://github.com/hansogj/utils-ws/pull/38
[#41]: https://github.com/hansogj/utils-ws/pull/41
[#45]: https://github.com/hansogj/utils-ws/pull/45
[#47]: https://github.com/hansogj/utils-ws/pull/47
