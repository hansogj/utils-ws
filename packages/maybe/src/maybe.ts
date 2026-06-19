/**
 * A value that may be present or absent (`undefined` / `null`).
 *
 * Used as `T | undefined` in type signatures throughout `Maybe`.
 */
export type Optional<T> = T | undefined;

/**
 * Container for an optional value with helpers for safe mapping, default
 * extraction, and conditional side-effects. Treat `null` and `undefined` as
 * the same "nothing" state; everything else (including `0`, `''`, `false`,
 * `{}`, `[]`) is "something".
 *
 * Prefer the `maybe()` factory or `Maybe.just` / `Maybe.nothing` over
 * constructing directly.
 *
 * @example
 *   maybe(user)
 *     .mapTo('email')
 *     .ifSomething(send)
 *     .valueOr('no email');
 */
export class Maybe<Value> {
  private readonly wrappedValue: Optional<Value>;

  constructor(wrappedValue: Optional<Value>) {
    this.wrappedValue = wrappedValue;
  }

  /** Return the wrapped value, or `defaultValue` if nothing. */
  valueOr = <T>(defaultValue: T): Value | T =>
    Maybe.isSomething(this.wrappedValue) ? this.wrappedValue : defaultValue;

  /** Return the wrapped value, or throw `error` if nothing. */
  valueOrThrow = (
    error: Error = new TypeError('Wrapped value is undefined or null'),
  ): Value | never =>
    this.valueOrExecute(() => {
      throw error;
    });

  /** Return the wrapped value, or the result of `closure()` if nothing. */
  valueOrExecute = <T>(closure: () => T | Value): T | Value =>
    Maybe.isSomething(this.wrappedValue) ? this.wrappedValue : closure();

  /** `true` if a non-null value is wrapped. */
  isSomething = (): boolean => !this.isNothing();

  /** `true` if the wrapped value is `null` or `undefined`. */
  isNothing = (): boolean => this.wrappedValue === undefined || this.wrappedValue === null;

  /**
   * Apply `mapper` to the wrapped value and return a new `Maybe`. If the
   * current Maybe is nothing, or `mapper` returns `undefined`/`null`, the
   * result is nothing.
   */
  map = <Output>(mapper: (value: Value) => Optional<Output>): Maybe<Output> =>
    // eslint-disable-next-line
    // @ts-ignore
    this.isNothing() ? Maybe.nothing() : new Maybe(mapper(this.wrappedValue));

  /** Like `map`, but `mapper` already returns a `Maybe`. Flattens the result. */
  flatMap = <Output>(mapper: (value: Value) => Maybe<Output>): Maybe<Output> =>
    this.map(mapper).map((it) => it.wrappedValue);

  /** Run `callback` with the value (for side effects), then return `this`. */
  tap = (callback: (val: Value) => unknown) => {
    // eslint-disable-next-line
    // @ts-ignore
    callback(this.wrappedValue);
    return this;
  };

  /** Run `callback` only when the value is nothing. Returns `this`. */
  ifNothing = (callback: () => void): Maybe<Value> => {
    if (this.isNothing()) {
      callback();
    }
    return this;
  };

  /** Run `callback` only when the value is something. Returns `this`. */
  ifSomething = (callback: (_: Value) => void): Maybe<Value> =>
    this.map((value) => {
      callback(value);
      return value;
    });

  /** Keep the value only if `filter` returns true; otherwise become nothing. */
  nothingUnless = (filter: (_: Value) => boolean): Maybe<Value> =>
    this.map((value) => (filter(value) ? value : undefined));

  /** Become nothing if `filter` returns true. */
  nothingIf = (filter: (_: Value) => boolean): Maybe<Value> =>
    this.nothingUnless((it) => !filter(it));

  /** Keep the value only if it is truthy. */
  ifTrue = () => this.nothingUnless((value: Value) => Boolean(value));

  /** Keep the value only if it is falsy. */
  ifFalse = () => this.nothingUnless((value: Value) => !Boolean(value));

  /** If nothing, return `other`; otherwise return `this`. */
  or = (other: Maybe<Value>): Maybe<Value> => (this.isNothing() ? other : this);

  /** If nothing, return `Maybe.just(other)`; otherwise return `this`. */
  orJust = (other: Value): Maybe<Value> => (this.isNothing() ? Maybe.just(other) : this);

  /**
   * Combine two Maybes into a Maybe of `[Value, OtherValue]`. The result is
   * nothing if either side is nothing.
   */
  zip<OtherValue>(other: Maybe<OtherValue>): Maybe<[Value, OtherValue]> {
    return this.map(
      (it) => other.map((t: OtherValue): [Value, OtherValue] => [it, t]).wrappedValue,
    );
  }

  /** Project to a property of the wrapped value (typed). */
  mapTo = <Key extends keyof Value>(key: Key): Maybe<Value[Key]> => this.map((value) => value[key]);

  /**
   * Build a new object containing only the picked keys whose values are
   * something. Keys whose values are nothing are silently omitted.
   */
  pick = <Key extends keyof Value>(...keys: Key[]): Maybe<Record<Key, Value[Key]>> =>
    new Maybe(
      keys.reduce(
        (curr, key) =>
          this.mapTo(key)
            .map((it) => ({
              ...curr,
              [key]: it,
            }))
            .valueOr(curr),
        {} as Record<Key, Value[Key]>,
      ),
    );

  /**
   * Stringify the wrapped value. Strings return as-is (no JSON wrapping
   * quotes); everything else uses `JSON.stringify`.
   *
   * @example
   *   maybe('hello').stringify().valueOr('');        // → 'hello'
   *   maybe({ a: 1 }).stringify().valueOr('');       // → '{"a":1}'
   */
  stringify = (): Maybe<string> =>
    this.map((value) => (typeof value === 'string' ? value : JSON.stringify(value)));

  /** Wrap a value (which may be nothing) in a `Maybe`. */
  static just<Value>(value: Value): Maybe<Value> {
    return new Maybe<Value>(value);
  }

  /** A `Maybe` representing the absence of a value. */
  static nothing<Value>(): Maybe<Value> {
    return new Maybe<Value>(undefined);
  }

  /** Type guard: `true` if `value` is not `null`/`undefined`. */
  static isSomething<Value>(value: Optional<Value>): value is Value {
    return !this.isNothing(value);
  }

  /** Type guard: `true` if `value` is `null` or `undefined`. */
  static isNothing<Value>(value: Optional<Value>): value is undefined {
    return new Maybe(value).isNothing();
  }
}

/**
 * Construct a `Maybe<Value>` from a possibly-absent value. Equivalent to
 * `Maybe.just(value)` for non-null, `Maybe.nothing()` otherwise.
 *
 * @example
 *   maybe(user).mapTo('email').valueOr('no email');
 */
export default function maybe<Value>(value: Optional<Value>): Maybe<Value> {
  if (Maybe.isNothing(value)) {
    return Maybe.nothing();
  }

  return Maybe.just(value);
}
