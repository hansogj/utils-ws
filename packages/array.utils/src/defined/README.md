## Check existence of properties or variables

```typescript
// import as polyfill into your src
import '@hansogj/array.utils';
[1, 2, null, undefined].defined(); // => [1,2]
```

```typescript
// import as functions
import { defined, definedList } from '@hansogj/array.utils';

defined(null); // => false
defined(undefined); // => false
definedList([1, 2]); // => [1, 2]
definedList([undefined, null]); // => []
[1, 2, 3].first(); // => [1]
[1, 2, 3].last(); // => [3]
```

### Template for wrapping immutable lists

```typescript
import {Iterable, List} from 'immutable';
import {defined} from '@hansogj/array.utils';

Iterable.prototype.defined = defined(Iterable.prototype.defined)
    ? Iterable.prototype.defined
    : function (this: any) {
          return this.toList().filter((e: any) => defined(e));
      };

Iterable.prototype.allDefined = defined(Iterable.prototype.allDefined)
    ? Iterable.prototype.allDefined
    : function (this: any) {
          return this.toList().every((e: any) => defined(e)) ? this : List();
      };
```

### Usage with commonJs

```js
const arrayDefined = require('@hansogj/array.utils');
const {defined, definedList} = arrayDefined;
console.log(defined([1])); // => [1]
```

### Usage as a clean ESM sub-entry

```ts
import { defined, definedList } from '@hansogj/array.utils/defined';

defined(null); // => false
definedList([1, undefined, 2]); // => [1, 2]
```

### Usage with Vanilla js

```html
<!-- index.html -->
<script src="../node_modules/@hansogj/array.utils/dist/index.js"></script>
<script src="../node_modules/@hansogj/array.utils/dist/defined/index.js"></script>
<script>
  // window globals exposed by each UMD bundle
  const { defined, definedList } = window.defined;
  console.log(defined([1])); // => [1]
</script>
```

## Breaking v2.0.0

Moved distributed file from _lib_ to _dist_
