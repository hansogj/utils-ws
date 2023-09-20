## Flatten deep arrays

```js
import '@hansogj/array.utils';
expect([[1], [2], [3]].flatMap((self) => self)).toEqual([1, 2, 3]);
```

See [flatMap.spec.ts](./flatMap.spec.ts) for more examples
