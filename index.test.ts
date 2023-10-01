import { test, expect } from "bun:test";
import { Result } from "./index";

test("new unwrap", () => {
  const r = new Result(null, null, true);
  expect(r.unwrap()).toBe(null);
});

test("ok unwrap", () => {
  const r = Result.ok(1);
  expect(r.unwrap()).toBe(1);
  expect(() => r.unwrapError()).toThrow("Expected error, but found ok '1'");
});

test("error unwrap", () => {
  const r = Result.error("Broke");
  expect(() => r.unwrap()).toThrow("Expected ok, but found error 'Broke'");
  expect(r.unwrapError()).toBe("Broke");
});

test("ok map", () => {
  const r = Result.ok(1);
  const updatedR = r.map((x) => `${x}`);
  expect(updatedR.unwrap()).toBe("1");
});

test("error map", () => {
  const r = Result.error(1);
  const updatedR = r.map((x) => `${x}`);
  expect(updatedR.unwrapError()).toBe(1);
});

test("ok mapError", () => {
  const r = Result.ok(1);
  const updatedR = r.mapError((x) => `${x}`);
  expect(updatedR.unwrap()).toBe(1);
});

test("error mapError", () => {
  const r = Result.error(1);
  const updatedR = r.mapError((x) => `${x}`);
  expect(updatedR.unwrapError()).toBe("1");
});

test("chain works with types", () => {
  const out = Result.ok(1)
    .map((x) => x + 1)
    .map((x) => 2 * x)
    .flatMap((x) => Result.error(`${x}`))
    .map((x) => x + 3)
    .mapError((x) => x.concat("2") )
    .flatMapError((x) => Result.ok(Number(x)))
    .map((x) => x + 1)
    .unwrap()

    expect(out).toBe(43)
});
