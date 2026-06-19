declare global {
    interface Array<T> {
        /**
         * Run `cb(self)` only when the array is empty, then always return
         * the array — fluent escape-hatch for empty-state side effects.
         *
         * @example
         *   results.onEmpty(() => log('no results')).map(render);
         */
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
