/* eslint-disable @typescript-eslint/no-explicit-any */
import { defined } from './defined';

/**
 * Coerce `prop` into an array of "defined" items.
 *
 * - If `prop` is itself undefined/null, returns `[]`.
 * - If `prop` is an array, returns it filtered by `defined`.
 * - Otherwise wraps `prop` in a single-element array, then filters.
 *
 * @example
 *   definedList([1, null, 2])  // [1, 2]
 *   definedList(undefined)     // []
 *   definedList('x')           // ['x']
 *   definedList('')            // []
 */
export const definedList = <T>(prop: T): T[] => {
    if (!defined(prop) || !defined((prop as T[]).constructor)) {
        return [];
    }

    if ((prop as T[]).constructor !== [].constructor) {
        return [prop as any].filter((p) => defined(p));
    }
    return (prop as T[]).filter((p: T) => defined(p));
};
