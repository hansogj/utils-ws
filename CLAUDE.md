# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package manager

pnpm is enforced via `preinstall: only-allow pnpm`. Do not run `npm install` or `yarn` — they will be rejected. Lockfile is `pnpm-lock.yaml`.

## Common commands

Run from the repo root:

- `pnpm i --frozen-lockfile` — install
- `pnpm run build` — build every package (`pnpm -r build`)
- `pnpm test` — run all Jest tests (runs serially with `--runInBand`, uses `NODE_ICU_DATA=node_modules/full-icu`)
- `pnpm run test:watch` — watch mode
- `pnpm run test:coverage` — coverage report
- `pnpm run lint` — ESLint on `packages/**/src`
- `pnpm run ws:ts` — `tsc --noEmit` across every package (the per-package `ts` script)
- `pnpm run circularity:check` — `madge` circular-dependency check over `./packages`
- `pnpm run pre-commit` — runs `ws:ts` → `circularity:check` → `lint` → `test` (also wired via husky)

Run a single test file:

```bash
pnpm test -- packages/array.utils/src/defined/some-file.spec.ts
# or by name pattern:
pnpm test -- -t "name of test"
```

Jest pattern is `**/*.spec.{ts,tsx,js}`. There is no per-package jest config — the root `jest` config in `package.json` matches across the whole workspace.

## Scaffolding a new package

```bash
pnpm run generate -- "<name-of-package>"
```

`scripts/generate.js` creates `packages/<name>/`, runs `pnpm init`, rewrites the new `package.json` with the standard build/clean/ts scripts and publish config, copies `tsconfig.pkg.json` + `webpack.config.js` + `.npmignore`, and inserts a link into the root README at the `package-list-placeholder-do-not-remove` marker. Don't hand-edit that placeholder line.

Internal cross-package deps use `workspace:*`:

```bash
cd packages/<target> && pnpm add --workspace <name-of-package>
```

## Versioning & publishing

- `pnpm run ws:version:set:all --bump=<major|minor|patch|...>` — bumps every package together and tags via `scripts/ws-scripts.sh`. The shell script function `gitCommitTagPush` runs `git commit -a --no-verify` then `git tag` then `git push --follow-tags`, using `<package-name>@<version>` as the tag.
- Single-package bump: `cd packages/<target> && pnpm version <strategy> && ../../scripts/ws-scripts.sh gitCommitTagPush`
- Publish: `pnpm run build && pnpm -r publish --access=public` (or per package).

`scripts/ws-scripts.sh` is the dispatcher. It exposes `every <fn>` (iterate every package and run `<fn>` inside it) and `workspaces <fn>` (call `<fn>` once per package, passing the path). All `ws:*` npm scripts delegate to it.

## Architecture

pnpm-workspace monorepo (`pnpm-workspace.yaml` → `packages/*`) of independently-versioned, independently-published `@hansogj/*` packages. There is no shared runtime layer — each package builds and publishes its own `dist/`.

**TypeScript layout.** Root `tsconfig.build.json` is the shared compiler-options base; each package extends it via its own `tsconfig.pkg.json` (created by `scripts/generate.js`). Root `tsconfig.json` is for IDE/workspace-wide checks only. `tsconfig.eslint.json` is consumed by the ESLint parser (`parserOptions.project`).

**Build pipelines differ by package — do not assume one shape:**

- `array.utils`, `find-js`, `abonnement-js` — webpack + ts-loader (`build:wp`), UMD output with `libraryTarget: 'umd'`, entry `src/index.ts`, output to `dist/index.js`. The shared `webpack.build.js` at the root provides the rules; each package's `webpack.config.js` extends it with `entry`/`output`.
- `immer-reduxer` — `tsc` only (no webpack bundle), declarations emitted to `dist/`. `peerDependencies` cover `immer`, `redux`, `react-redux`.
- `git-prompt` — TypeScript (CommonJS). Built with `@vercel/ncc` into three CLI binaries (`git-prompt-co`, `git-prompt-commit`, `git-prompt-retry`) exposed via `bin` in its `package.json`. ncc auto-discovers `tsconfig.json` in the package directory (not `tsconfig.pkg.json` like the other packages); `declaration: false` keeps the bundles from emitting stray `.d.ts` files. The `ts` script runs real `tsc --noEmit`.

**Dependency direction.** Internal deps use `workspace:*`. Currently `abonnement-js` depends on `array.utils`. Keep the graph acyclic — `pnpm run circularity:check` (madge) is part of `pre-commit` and will fail the commit on cycles.

## Lint / formatting

- ESLint flat config (`eslint.config.mjs`) extends `airbnb-typescript/base`, `prettier`, and `@typescript-eslint/recommended`. Notable rule: `"arrow-body-style": ["error", "as-needed"]` — don't wrap single-expression arrows in braces+return.
- Prettier config in `.prettierrc.json`. Run `pnpm run prettier:write` to format `packages/**/*.{ts,tsx,js,jsx}`.
- `lint-staged` runs `eslint --fix` on staged TS/JS files.

## Pre-commit hook

`.husky/pre-commit` runs `pnpm run pre-commit`, which fails the commit if any of {`ws:ts`, `circularity:check`, `lint`, `test`} fail. Don't `--no-verify` to bypass — fix the underlying issue. (Note: the `ws:commit:tag:push` and `gitCommitTagPush` helpers do use `--no-verify` *intentionally* for release commits.)
