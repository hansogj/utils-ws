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
npm ci
```

## Add new package

```bash
npm run generate -- "<name-of-package>"
```

Dependencies & devDependencies are installed into your new package with

```bash
npm i some-package -w packages/consumer
```

To in make internal dependencies, do:

```bash
npm i ./packages/target -w packages/<name-of-package>
```

## Test & Build

From root run

```bash
npm run test
npm run build
```

These commands will test and build all the packages respectively

## Versioning

The npm-script _ws:version_ will ensure version and tagging are done right:

```bash
npm run ws:version:set:package --package=packages/<name-of-package> --bump=<new-version-number>
```

or as a bump action

```bash
npm run ws:version:set:all <major|minor|patch....>

```

## Publish

```bash
npm run build
npm publish --workspace @hansogj/<name-of-package>

```

or

```bash
npm run build
npm publish --ws

```
