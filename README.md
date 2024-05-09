[![example workflow](https://github.com/hansogj/utils-ws/actions/workflows/build.yml/badge.svg)](https://github.com/hansogj/utils-ws/actions/workflows/build.yml/badge.svg)

# Various frontend utils and polyfills

This libs are using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to achieve mono-repo multi-packages

## Workspaces

-   [immer-reduxer](./packages/immer-reduxer/README.md)
-   [find-js](./packages/find-js/README.md)
-   [abonnement-js](./packages/abonnement-js/README.md)
-   [array.utils](./packages/array.utils/README.md)

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
```

To in make internal dependencies, go to target package and do:

```bash
cd packages/<target>
pnpm add --workspace <name-of-package>
```

## Test & Build

From root run

```bash
pnpm run test
pnpm run build
```

These commands will test and build all the packages respectively

## Versioning

The pnpm-script _ws:version_ will ensure version and tagging are done right:

```bash
pnpm run ws:version:set:package --package=packages/<name-of-package> --bump=<new-version-number>
```

or as a bump action

```bash
pnpm run ws:version:set:all <major|minor|patch....>

```

## Publish

```bash
pnpm run build
pnpm publish --workspace @hansogj/<name-of-package>

```

or

```bash
pnpm run build
pnpm publish -r

```
