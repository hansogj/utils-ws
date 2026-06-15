[![example workflow](https://github.com/hansogj/utils-ws/actions/workflows/build.yml/badge.svg)](https://github.com/hansogj/utils-ws/actions/workflows/build.yml/badge.svg)

# Various frontend utils and polyfills

This libs are using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to achieve mono-repo multi-packages

## Workspaces

- [immer-reduxer](./packages/immer-reduxer/README.md)
- [find-js](./packages/find-js/README.md)
- [abonnement-js](./packages/abonnement-js/README.md)
- [array.utils](./packages/array.utils/README.md)
- [git-prompt](./packages/git-prompt/README.md)

[//]: <> (package-list-placeholder-do-not-remove)

## Install

```bash
pnpm i --frozen-lockfile
```

## Add new package

```bash
pnpm run generate -- "<name-of-package>"
```

Dependencies & devDependencies are installed into your new package with

```bash
cd  packages/<target>
pnpm add some-package
cd -
```

To in make internal dependencies, go to target package and do:

```bash
cd packages/<target>
pnpm add --workspace <name-of-package>
cd -
```

## Test & Build

From root run

```bash
pnpm run build
pnpm run test
```

`build` must run before `test` — the unit tests resolve internal dependencies through each package's `main` (`dist/index.js`), so a clean checkout needs to be built first. CI and the pre-commit hook both follow this order.

## Integration harness

End-to-end verification that the published packages work in three consumption modes — CommonJS, TypeScript/ESM and plain `<script>` tags. Lives under `apps/` (workspace-linked, not installed from npm) with shared helpers under `harness/shared`.

```bash
pnpm run harness:build      # builds shared + all three apps
pnpm run harness:test       # jest in web-cs + web-ts (web-js has no tests)
pnpm web-ts serve           # http://localhost:3113
pnpm web-cs serve           # http://localhost:4114
pnpm web-js start           # http://localhost:2112 (needs `pnpm web-js build` first)

# Run all three in containers (tears down any existing instance first)
docker compose -f harness/docker/docker-compose.yml down && \
  docker compose -f harness/docker/docker-compose.yml up
```

Versions shown in the apps come from a single source of truth: `harness/shared/scripts/build-deps.js` reads `packages/<pkg>/package.json` (workspace packages) and `node_modules/@hansogj/maybe/package.json` (external) and writes `harness/shared/src/deps.json`. The generator runs automatically on `pnpm i` via the `prepare` script.

## Versioning

The pnpm-script _ws:version:set:all_ will ensure all packages are updated with same strategy, and git tagging is done right

```bash
pnpm run ws:version:set:all <strategy: major|minor|patch....>

```

Changing version to a single workspace package, simply enter the package and do

```bash
cd packages/<target>
pnpm version <strategy: major|minor|patch....>
../../scripts/ws-scripts.sh gitCommitTagPush
cd -
```

## Publish

```bash
pnpm run build
cd packages/<target>
pnpm publish
cd -

```

or

```bash
pnpm run build
pnpm -r publish --access=public

```
