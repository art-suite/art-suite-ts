import { describe, it, expect } from "vitest"
import { reduce } from "../Comprehensions"

describe("Reduce comprehensions", () => {
  const mul = (a: number, b: number): number => a * b
  const add = (a: number, b: number): number => a + b
  const even = (a: number): boolean => a % 2 === 0
  const flatten = (a: any, b: number): number => b

  describe("basic operations", () => {
    it("multiplies array values", () => {
      expect(reduce([1, 2, 3, 4], mul)).toBe(24)
    })
    it("multiplies array values - inject 0 should make the whole thing 0", () => {
      expect(reduce([1, 2, 3, 4], { inject: 0, with: mul })).toBe(0)
    })

    it("sum with no inject", () => {
      expect(reduce([1, 2, 3, 4], add)).toBe(10)
    })

    it("sum with inject", () => {
      expect(reduce([1, 2, 3, 4], { inject: 10, with: add })).toBe(20)
    })

    it("multiplies object values", () => {
      expect(reduce({ a: 3, b: 4 }, mul)).toBe(12)
    })

    it("multiplies even array values", () => {
      expect(reduce([1, 2, 3, 4], { with: mul, when: even })).toBe(8)
    })
  })

  describe("inject/into aliases", () => {
    it("uses inject as initial value", () => {
      expect(reduce([], { inject: 123, with: add })).toBe(123)
    })
  })

  describe("array flattening behavior", () => {
    it("returns undefined for null input", () => {
      expect(reduce(null, { with: flatten })).toBeUndefined()
    })

    it("returns undefined for empty array", () => {
      expect(reduce([], { with: flatten })).toBeUndefined()
    })

    it("returns single element for single-element array", () => {
      expect(reduce([1], { with: flatten })).toBe(1)
    })

    it("returns last element for multi-element array", () => {
      expect(reduce([1, 2], { with: flatten })).toBe(2)
    })
  })

  describe("array flattening with initial value", () => {
    it("returns initial value for null input", () => {
      expect(reduce(null, { with: flatten, inject: [] as number[] })).toEqual([])
    })

    it("returns initial value for empty array", () => {
      expect(reduce([], { with: flatten, inject: [] as number[] })).toEqual([])
    })

    it("returns single element for single-element array", () => {
      expect(reduce([1], { with: flatten, inject: [] as number[] })).toBe(1)
    })

    it("returns last element for multi-element array", () => {
      expect(reduce([1, 2], { with: flatten, inject: [] as number[] })).toBe(2)
    })
  })
})
