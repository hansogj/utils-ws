const { createShouldIt, might, shouldIt } = require('shared');

describe('might', () => {
    it('returns "should" when true', () => expect(might(true)).toBe('should'));
    it('returns "should not" when false', () => expect(might(false)).toBe('should not'));
});

describe('createShouldIt — unit (mocked testFn) via CJS', () => {
    let testFn;
    let it$;

    beforeEach(() => {
        testFn = jest.fn();
        it$ = createShouldIt(testFn);
    });

    it('registers via .then when condition is true', () => {
        it$('do the thing', true).then(() => { });
        expect(testFn).toHaveBeenCalledWith('should do the thing', expect.any(Function), undefined);
    });

    it('registers via .dont when condition is false', () => {
        it$('do the thing', false).dont(() => { });
        expect(testFn).toHaveBeenCalledWith('should not do the thing', expect.any(Function), undefined);
    });

    it('appends JSON.stringify(toBe) on .then', () => {
        it$('answer with', true, [1, 2]).then(() => { });
        expect(testFn).toHaveBeenCalledWith('should answer with [1,2]', expect.any(Function), undefined);
    });

    it('is chainable', () => {
        it$('be chainable', true).then(() => { }).dont(() => { });
        expect(testFn).toHaveBeenCalledTimes(1);
    });
});

describe('shouldIt — global-test convenience via CJS', () => {
    const captured = [];
    const recordingTest = (name, fn, timeout) => {
        captured.push(name);
        test(name, fn || (() => { }), timeout);
    };
    const it$ = createShouldIt(recordingTest);

    it$('echo via CJS', true).then(() => expect(true).toBe(true));
    it$('explode via CJS', false).dont(() => expect(true).toBe(true));

    test('recorded the expected names', () =>
        expect(captured).toEqual(['should echo via CJS', 'should not explode via CJS']));

    test('shouldIt convenience falls back to global `test`', () => {
        const labels = [];
        const original = globalThis.test;
        globalThis.test = (name) => labels.push(name);
        try {
            shouldIt('use the global test', true).then(() => { });
        } finally {
            globalThis.test = original;
        }
        expect(labels).toEqual(['should use the global test']);
    });
});
