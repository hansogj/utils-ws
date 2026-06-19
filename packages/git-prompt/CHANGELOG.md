# Changelog

All notable changes to `@hansogj/git-prompt`. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project follows [Semantic Versioning](https://semver.org/).

Older history before the move into the `utils-ws` monorepo lives in git tags.

## [Unreleased]

### Fixed
- `splitBranchName` no longer silently drops the entire branch identity for branches with 4+ segments. The first segment becomes `type`, the second becomes `ticker`, everything from the third onward joins back into `scope` with `/`. 3-segment behaviour is unchanged. ([#44])

## [0.5.2] – 2026-06-13

### Changed
- Harmonized package metadata with the rest of the workspace. ([#41])

## [0.5.1] – earlier 2026

### Added
- Modernized `package.json` metadata (description, keywords, repository, bugs, homepage); converted source to TypeScript with a CommonJS output bundled by `@vercel/ncc`. ([#40])

## Earlier — `wip` type and commit-only filter

The conventional types list gained `wip` (work-in-progress) as a commit-only type — together with `chore` and `docs`, these can't be used as branch prefixes. The `wip` type intentionally skips the strict subject rules so it can serve as a quick collaborator-handoff signal.

[#40]: https://github.com/hansogj/utils-ws/pull/40
[#41]: https://github.com/hansogj/utils-ws/pull/41
[#44]: https://github.com/hansogj/utils-ws/pull/44
