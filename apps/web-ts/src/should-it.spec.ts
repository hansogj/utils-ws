import { createShouldIt, might, shouldIt } from 'shared';

describe('might', () => {
  it('returns "should" when true', () => expect(might(true)).toBe('should'));
  it('returns "should not" when false', () => expect(might(false)).toBe('should not'));
});

describe('createShouldIt — unit (mocked testFn)', () => {
  let testFn: jest.Mock;
  let it$: ReturnType<typeof createShouldIt>;

  beforeEach(() => {
    testFn = jest.fn();
    it$ = createShouldIt(testFn);
  });

  describe('.then', () => {
    it('registers a test when condition is true', () => {
      const body = () => {};
      it$('greet the world', true).then(body);
      expect(testFn).toHaveBeenCalledTimes(1);
      expect(testFn).toHaveBeenCalledWith('should greet the world', body, undefined);
    });

    it('is a no-op when condition is false', () => {
      it$('greet the world', false).then(() => {});
      expect(testFn).not.toHaveBeenCalled();
    });

    it('appends a JSON-stringified toBe value to the test name', () => {
      it$('return', true, { answer: 42 }).then(() => {});
      expect(testFn).toHaveBeenCalledWith('should return {"answer":42}', expect.any(Function), undefined);
    });

    it('does NOT append toBe when toBe is falsy (0, false, "") — bug-for-bug from the original', () => {
      it$('count', true, 0).then(() => {});
      expect(testFn).toHaveBeenCalledWith('should count', expect.any(Function), undefined);
    });

    it('forwards the timeout argument', () => {
      it$('be patient', true).then(() => {}, 5000);
      expect(testFn).toHaveBeenCalledWith('should be patient', expect.any(Function), 5000);
    });
  });

  describe('.dont', () => {
    it('registers a test when condition is false', () => {
      it$('explode', false).dont(() => {});
      expect(testFn).toHaveBeenCalledWith('should not explode', expect.any(Function), undefined);
    });

    it('is a no-op when condition is true', () => {
      it$('explode', true).dont(() => {});
      expect(testFn).not.toHaveBeenCalled();
    });

    it('does NOT append toBe to the negative-case label', () => {
      it$('return', false, { answer: 42 }).dont(() => {});
      expect(testFn).toHaveBeenCalledWith('should not return', expect.any(Function), undefined);
    });
  });

  describe('chaining', () => {
    it('exposes both .then and .dont on a single call, exactly one fires per condition', () => {
      it$('be lazy', true)
        .then(() => {})
        .dont(() => {});
      it$('be lazy', false)
        .then(() => {})
        .dont(() => {});
      expect(testFn).toHaveBeenCalledTimes(2);
      expect(testFn.mock.calls.map((c) => c[0])).toEqual(['should be lazy', 'should not be lazy']);
    });
  });
});

describe('shouldIt — integration with the real jest `test` global', () => {
  const captured: string[] = [];
  const recordingTest = ((name, fn, timeout) => {
    captured.push(name);
    test(name, fn ?? (() => {}), timeout);
  }) as typeof test;
  const it$ = createShouldIt(recordingTest);

  it$('register a positive case', true).then(() => expect(true).toBe(true));
  it$('register a negative case', false).dont(() => expect(false).toBe(false));

  test('registered exactly the expected names', () =>
    expect(captured).toEqual(['should register a positive case', 'should not register a negative case']));

  test('the global shouldIt convenience falls back to global `test` when present', () => {
    const labels: string[] = [];
    const originalTest = (globalThis as { test?: unknown }).test;
    (globalThis as { test?: unknown }).test = (name: string) => labels.push(name);
    try {
      shouldIt('use the global test', true).then(() => {});
    } finally {
      (globalThis as { test?: unknown }).test = originalTest;
    }
    expect(labels).toEqual(['should use the global test']);
  });
});
