## Check existence of properties or variables

```typescript
// import defined or polyfill into your src
import '@hansogj/array.utils';
import { defined, definedList } from 'array.utils/dist/defined';

[1, 2, null, undefined].defined(); // => [1,2]
defined(null); // => false
defined(undefined); // => false
definedList([1, 2]); // => [1,2]
definedList([undefined, null]) // => []
  [
    // filter first
    (1, 2, 3)
  ].first() // => [1]
  [
    // filter last
    (1, 2, 3)
  ].last(); // => [3]
```

### Template for wrapping immutable lists

```typescript
import { Iterable, List } from 'immutable';
import { defined } from '@hansogj/array.utils/dist/defined';

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

## Breaking v2.0.0

Moved distributed file from _lib_ to _dist_
