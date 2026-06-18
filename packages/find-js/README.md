# find-js

[![npm version](https://img.shields.io/npm/v/@hansogj/find-js)](https://www.npmjs.com/package/@hansogj/find-js)
[![known vulnerabilities](https://snyk.io/test/npm/@hansogj/find-js/badge.svg)](https://snyk.io/test/npm/@hansogj/find-js)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@hansogj/find-js)](https://bundlephobia.com/package/@hansogj/find-js)

Returns an iterable array of node-elements.

## Usage

### ESM (bundler / Node ≥18)

```js
import find from '@hansogj/find-js';

console.log(find('h2', window.document.body));
```

### CommonJS

```js
const find = require('@hansogj/find-js').default;

console.log(find('h2', window.document.body));
```

### Vanilla `<script>` tag

```html
<script src="../node_modules/@hansogj/find-js/dist/index.js"></script>
<script>
  const find = window.find.default;
  console.log(find('h2', window.document.body));
</script>
```

### TypeScript

```ts
import find from '@hansogj/find-js';

console.log(find('h2', window.document.body));
```
