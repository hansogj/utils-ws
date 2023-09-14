## Enable call of callback function to empty arrays

``` js
    import "@hansogj/array.utils";
    [1,2,3,4,5]
    .filter((item) =>  item > 10 ) //this should return an empty list
    .onEmpty(() => console.log('Ey! This is an empty list'));

    []
    .onEmpty((empty) => empty.push(1)) //returning an array : [1]
    .onEmpty(() => {
         //now this won't be invoked
     });

```