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
    constructor(value: T, error: E) {
        this.ok = true;
        this.#error = error;
        this.#value = value;
    }

    static ok<T, E>(value: T): Result<T, null> {
        return new Result(value, null)
    }

    static error<T, E>(error: E): Result<null, E> {
        const result = new Result(null, error)
        result.ok = false;
        return result
    }

    map<R>(func: (value: T) => R): Result<R, null> | Result<T, E>  {
        if (this.ok) {
            return Result.ok(func(this.#value))
        } else {
            return this
        }
    }

    // is this a nice name?
    flatMap<R, F>(func: (value: T) => Result<R, F> ) : Result<R, F> | Result<T, E>  {
        if (this.ok) {
            return func(this.#value)
        } else {
            return this
        } 
    }

    unwrap() {
        if (this.ok) {
            return this.#value
        } else {
            throw new ResultError(`Expected ok, but found error '${this.#error}'`)
        }
    }

    unwrapError() {
        if (!this.ok) {
            return this.#error
        } else {
            throw new ResultError(`Expected error, but found ok '${this.#value}'`)
        }
    }
}