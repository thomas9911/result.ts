function isError(err: unknown): err is Error {
  return err instanceof Error;
}

export class ResultError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResultError";
  }
}

export class Result<T, E> {
  #value: T;
  #error: E;
  /**
   * Returns true when Result holds an ok value
   */
  isOk: boolean;
  constructor(value: T, error: E, isOk: boolean) {
    this.isOk = isOk;
    this.#error = error;
    this.#value = value;
  }

  /**
   * Create Result with an ok value
   */
  static ok<T, E>(value: T): Result<T, never> {
    return new Result(value, null, true) as Result<T, never>;
  }

  /**
   * Create Result with an error value
   */
  static error<T, E>(error: E): Result<never, E> {
    return new Result(null, error, false) as Result<never, E>;
  }

  /**
   * Returns true when Result holds an error value
   */
  get isErr(): boolean {
    return !this.isOk;
  }

  /**
   * Returns the ok and error parts in an array
   */
  toArray(): [T, E] {
    return [this.#value, this.#error];
  }

  map<R>(func: (value: T) => R): Result<R, E> {
    if (this.isOk) {
      return new Result(func(this.#value), this.#error, true);
    } else {
      return this as unknown as Result<R, E>;
    }
  }

  mapError<R>(func: (value: E) => R): Result<T, R> {
    if (this.isErr) {
      return new Result(this.#value, func(this.#error), false);
    } else {
      return this as unknown as Result<T, R>;
    }
  }

  // is this a nice name?
  flatMap<R, F>(func: (value: T) => Result<R, F>): Result<R, E | F> {
    if (this.isOk) {
      return func(this.#value);
    } else {
      return this as unknown as Result<never, E>;
    }
  }

  // is this a nice name?
  flatMapError<R, F>(func: (value: E) => Result<R, F>): Result<T | R, F> {
    if (this.isErr) {
      return func(this.#error);
    } else {
      return this as unknown as Result<T, never>;
    }
  }

  unwrap() {
    if (this.isOk) {
      return this.#value;
    } else {
      if (isError(this.#error)) {
        throw this.#error;
      } else {
        throw new ResultError(`Expected ok, but found error '${this.#error}'`);
      }
    }
  }

  unwrapError() {
    if (this.isErr) {
      return this.#error;
    } else {
      throw new ResultError(`Expected error, but found ok '${this.#value}'`);
    }
  }

  unpack(): T | null {
    if (this.isOk) {
      return this.#value;
    } else {
      return null;
    }
  }

  unpackError(): E | null {
    if (this.isErr) {
      return this.#error;
    } else {
      return null;
    }
  }
}
