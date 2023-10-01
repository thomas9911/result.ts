export class ResultError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResultError";
  }
}

export class Result<T, E> {
  #value: T;
  #error: E;
  ok: boolean;
  constructor(value: T, error: E, isOk: boolean) {
    this.ok = isOk;
    this.#error = error;
    this.#value = value;
  }

  static ok<T, E>(value: T): Result<T, never> {
    return new Result(value, null, true) as Result<T, never>;
  }

  static error<T, E>(error: E): Result<never, E> {
    return new Result(null, error, false) as Result<never, E>;
  }

  toArray(): [T, E] {
    return [this.#value, this.#error];
  }

  map<R>(func: (value: T) => R): Result<R, E> | Result<T, E> {
    if (this.ok) {
      return new Result(func(this.#value), this.#error, true);
    } else {
      return this;
    }
  }

  mapError<R>(func: (value: E) => R): Result<T, E> | Result<T, R> {
    if (!this.ok) {
      return new Result(this.#value, func(this.#error), false);
    } else {
      return this;
    }
  }

  // is this a nice name?
  flatMap<R, F>(func: (value: T) => Result<R, F>): Result<R, F> | Result<T, E> {
    if (this.ok) {
      return func(this.#value);
    } else {
      return this;
    }
  }

  // is this a nice name?
  flatMapError<R, F>(func: (value: E) => Result<R, F>): Result<R, F> | Result<T, E> {
    if (!this.ok) {
      return func(this.#error);
    } else {
      return this;
    }
  }

  unwrap() {
    if (this.ok) {
      return this.#value;
    } else {
      throw new ResultError(`Expected ok, but found error '${this.#error}'`);
    }
  }

  unwrapError() {
    if (!this.ok) {
      return this.#error;
    } else {
      throw new ResultError(`Expected error, but found ok '${this.#value}'`);
    }
  }
}
