import {test, expect} from 'bun:test'
import { Result } from './index'

test("new unwrap", () => {
    const r = new Result(null, null)
    expect(r.unwrap()).toBe(null)
})

test("ok unwrap", () => {
    const r = Result.ok(1)
    expect(r.unwrap()).toBe(1)
    expect(() => r.unwrapError()).toThrow("Expected error, but found ok '1'")
})

test("error unwrap", () => {
    const r = Result.error("Broke")
    expect(() => r.unwrap()).toThrow("Expected ok, but found error 'Broke'")
    expect(r.unwrapError()).toBe("Broke")
})

test("map", () => {
    const r = Result.ok(1)
    const updatedR = r.map((x) => `${x}`);
    expect(updatedR.unwrap()).toBe("1")
})
