import './';

describe('Array.onEmpty test', () => {
    afterEach(jest.resetAllMocks);
    it('callback  should be called on empty array', () => {
        const spy = jest.fn();
        [].onEmpty(spy);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('callback should not be called on not empty array', () => {
        const spy = jest.fn();
        [1].onEmpty(spy);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should return the array that onEmpty was invoked on', () => {
        expect([].onEmpty((e) => e).length).toBe(0);
        expect([1].onEmpty((e) => e).length).toBe(1);
    });

    it('should be able to manipulate the array onEmpty was invoked on', () => {
        const pushOne = (empty: number[]) => {
            empty.push(1);
            return empty;
        };
        expect(([] as Array<number>).onEmpty(pushOne).length).toBe(1);
        expect(([] as Array<number>).onEmpty(pushOne)).toEqual([1]);
    });
});
