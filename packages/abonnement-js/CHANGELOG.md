# Changelog

All notable changes to `@hansogj/abonnement-js`. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project follows [Semantic Versioning](https://semver.org/).

Older history before the move into the `utils-ws` monorepo lives in git tags.

## [Unreleased]

### Added
- JSDoc on `Abonnement`, `AlleAbonnementer`, `JoinedAbonnement` (with a note about the Norwegian-API translations: `abonner` = subscribe, `varsle` = notify, `avslutt` = unsubscribe, `verdi` = value). ([#47])

## [4.7.5] – 2026-06-13

### Changed
- Harmonized package shape across all workspace libraries. ([#41])

## [4.7.4] – earlier 2026

### Added
- Modernized packaging: dual ESM (`.mjs`) + CJS (`.cjs`) exports via Vite, UMD (`.js`) for script-tag consumers. ([#39])

[#39]: https://github.com/hansogj/utils-ws/pull/39
[#41]: https://github.com/hansogj/utils-ws/pull/41
[#47]: https://github.com/hansogj/utils-ws/pull/47
