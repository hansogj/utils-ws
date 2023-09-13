[![example workflow](https://github.com/github/docs/actions/workflows/webpack.yml/badge.svg)](https://github.com/hansogj/utils-ws/actions/workflows/webpack.yml/badge.svg)

# Frontend utils for forsikring

This libs are using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to achieve mono-repo multi-packages

## Workspaces

- [immer-reduxer](./packages/immer-reduxer/README.md)
- [find-js](./packages/find-js/README.md)
- [abonnement-js](./packages/abonnement-js/README.md)

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

whereas

```bash
