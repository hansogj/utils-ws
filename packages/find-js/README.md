# find-js

[![npm version](https://img.shields.io/npm/v/@hansogj/find-js)](https://www.npmjs.com/package/@hansogj/find-js)
[![known vulnerabilities](https://snyk.io/test/npm/@hansogj/find-js/badge.svg)](https://snyk.io/test/npm/@hansogj/find-js)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@hansogj/find-js)](https://bundlephobia.com/package/@hansogj/find-js)

Returns an iterable array of node-elements.

## Usage

### JS

```js
// either
const find = require("@hansogj/find-js").default;

//or
<script src="../node_modules/@hansogj/find-js/dist/index.js"></script>
const find = window.find.default;

----
console.log(find('h2', window.document.body));
```

### TS

```ts
import find from 'find-js';

console.log(find('h2', window.document.body));
```
