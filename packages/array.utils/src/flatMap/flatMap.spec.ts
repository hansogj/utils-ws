import './flatMap';
describe('array.flatmap test', function () {
    it('array.flatmap should be defined', function () {
        expect(Array.prototype.flatMap).toBeDefined();
        expect([].flatMap).toBeDefined();
    });

    it('missing lambda should throw', function () {
        // eslint-disable-next-line
        // @ts-ignore
        expect(() => [].flatMap()).toThrowError(TypeError);
    });

    it('single level array  should return as is', function () {
        expect([1, 2, 3].flatMap((self) => self)).toEqual([1, 2, 3]);
    });

    it('deep level array  should retur flattend', function () {
        expect([[1], [2], [3]].flatMap((self) => self)).toEqual([1, 2, 3]);
    });

    it('deep level array  should retur flattend', function () {
        expect([[1], [2], [3]].flatMap((self) => self)).toEqual([1, 2, 3]);
    });
});
