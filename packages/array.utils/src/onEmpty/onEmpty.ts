declare global {
    interface Array<T> {
        onEmpty: (cb: (self: Array<T>) => Array<T>) => Array<T>;
    }
}

if (!Array.prototype.hasOwnProperty('onEmpty')) {
    Array.prototype.onEmpty = function <T>(cb: (self: Array<T>) => Array<T>) {
        const array: Array<T> = Object(this);
        if (array.length === 0) {
            cb(array);
        }
        return array;
    };
}
export {};
