# ARRAY.UTILS

[![npm version](https://img.shields.io/npm/v/@hansogj/array.utils)](https://www.npmjs.com/package/@hansogj/array.utils)
[![known vulnerabilities](https://snyk.io/test/npm/@hansogj/array.utils/badge.svg)](https://snyk.io/test/npm/@hansogj/array.utils)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@hansogj/array.utils)](https://bundlephobia.com/package/@hansogj/array.utils)

List of content:

-   [defined](./src/defined/README.md)
-   [onEmpty](./src/onEmpty/README.md)

## Breaking 3.0.0

`flatMap` polyfill removed — `Array.prototype.flatMap` has been native since Node 11 / ES2019, so the polyfill never ran. The `./flatMap` sub-entry is gone. If you imported it explicitly, drop the import; native `flatMap` is already available.

## Breaking 2.0.0

Polyfilling all features as one on main import `import '@hansogj/array.utils'`.

When in need of only one of the feature, you should import just the one, ie `import '@hansogj/array.utils/dist/defined'`
