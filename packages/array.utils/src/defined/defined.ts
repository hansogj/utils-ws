/**
 * `true` if `prop` is meaningfully present.
 *
 * Treats `null`/`undefined` as undefined; for collections (with `length` or
 * `size`) requires non-emptiness; for booleans returns the boolean itself.
 * Functions, plain objects, numbers (including `0`), and non-empty strings
 * return `true`.
 *
 * @example
 *   defined(undefined)   // false
 *   defined(null)        // false
 *   defined([])          // false  (length is 0)
 *   defined([0])         // true
 *   defined('')          // false  (length is 0)
 *   defined('x')         // true
 *   defined(new Set())   // false  (size is 0)
 *   defined(false)       // false
 *   defined(0)           // true
 */
export const defined = <T>(prop: T): boolean => {
    if (prop === undefined || prop === null) {
        return false;
    }

    if (typeof prop === 'function') {
        return true;
    }

    if (prop.hasOwnProperty('length')) {
        return (prop as T[]).length > 0;
    }

    if (prop.hasOwnProperty('size')) {
        return (prop as T & { size: number }).size > 0;
    }

    if (typeof prop === 'boolean') {
        return prop;
    }
    return true;
};
