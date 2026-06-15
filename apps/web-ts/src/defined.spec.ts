/**
 * @jest-environment jsdom
 */

import '@hansogj/array.utils/dist/defined';

describe('defined', () => {
    describe('defined', () => {
        const array = [null, undefined, false, true, {}];

        it('is defined', () => expect(array.defined).toBeDefined());

        it('has length', () => expect(array.defined()).toHaveLength(2));

        it('all defined', () => expect(array.allDefined()).toEqual([]));

        it('first', () => expect(array.first()).toEqual([null]));
    });
});
