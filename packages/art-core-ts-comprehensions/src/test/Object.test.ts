import { describe, it, expect } from "vitest"
import { x2, even } from "./testLib"
import { object } from "../Comprehensions"

describe("Object comprehensions", () => {
  describe("fromObjects", () => {
    it("handles empty object", () => {
      expect(object({})).toEqual({})
    })

    it("handles non-empty object", () => {
      expect(object({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 })
    })

    it("transforms values with x2", () => {
      expect(object({ a: 1, b: 2, c: 3, d: 4 }, x2)).toEqual({ a: 2, b: 4, c: 6, d: 8 })
    })

    it("transforms values with with option", () => {
      expect(object({ a: 1, b: 2, c: 3, d: 4 }, { with: x2 })).toEqual({ a: 2, b: 4, c: 6, d: 8 })
    })

    it("filters with when option", () => {
      expect(object({ a: 1, b: 2, c: 3, d: 4 }, { when: even })).toEqual({ b: 2, d: 4 })
    })

    it("transforms keys and values", () => {
      expect(object({ a: 1, b: 2 }, (v, k) => k + v)).toEqual({ a: "a1", b: "b2" })
    })

    it("transforms keys with withKey option", () => {
      expect(object({ a: 1, b: 2, c: 3, d: 4 }, { withKey: v => v * 11 })).toEqual({ 11: 1, 22: 2, 33: 3, 44: 4 })
    })
  })

  describe("fromArrays", () => {
    it("converts array to object with numeric keys", () => {
      expect(object([1, 2])).toEqual({ 1: 1, 2: 2 })
    })

    it("converts array to object with constant value", () => {
      expect(object([1, 2], () => true)).toEqual({ 1: true, 2: true })
    })

    it("transforms array values with x2", () => {
      expect(object([1, 2], x2)).toEqual({ 1: 2, 2: 4 })
    })

    it("transforms string array with key and value", () => {
      expect(object(["a", "b"], (v, k) => v + k)).toEqual({ a: "a0", b: "b1" })
    })
  })

  describe("fromMaps", () => {
    it("converts map to object with x2 transform", () => {
      const myMap = new Map([
        ["a", 1],
        ["b", 2],
        ["c", 3],
        ["d", 4]
      ])
      expect(object(myMap, x2)).toEqual({ a: 2, b: 4, c: 6, d: 8 })
    })
  })

  describe("fromSets", () => {
    it("converts set to object", () => {
      expect(object(new Set([1, 2]))).toEqual({ 0: 1, 1: 2 })
    })
  })

  describe("fromGenerators", () => {
    it("converts generator to object with x2 transform", () => {
      const generate3 = () => [1, 2, 3]
      expect(object(generate3(), x2)).toEqual({ 1: 2, 2: 4, 3: 6 })
    })
  })
})