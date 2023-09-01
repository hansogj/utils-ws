
## Flatten deep arrays

```js
    import "@hansogj/array.utils";
    expect([[1],[2],[3]].flatMap(function (self) {return self})).toEqual([1,2,3]);
```

See  [flatMap.spec.ts](./flatMap.spec.ts) for more examples
