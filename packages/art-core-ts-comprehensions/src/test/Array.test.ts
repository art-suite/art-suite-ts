import { describe, it, expect } from "vitest"
import { x2, even } from "./testLib"
import { array } from "../Comprehensions"

describe("Array comprehensions", () => {
  describe("basic operations", () => {
    it("handles null input", () => {
      expect(array(null)).toEqual([])
    })

    it("handles empty array", () => {
      expect(array([])).toEqual([])
    })

    it("converts object values to array with x2 transform", () => {
      expect(array({ a: 1, b: 2 }, x2)).toEqual([2, 4])
    })

    it("transforms array values with x2", () => {
      expect(array([1, 2, 3, 4], x2)).toEqual([2, 4, 6, 8])
    })

    it("filters and transforms array values", () => {
      expect(array([1, 2, 3, 4], { with: x2, when: even })).toEqual([4, 8])
    })

    it("transforms array values with with option", () => {
      expect(array([1, 2, 3, 4], { with: x2 })).toEqual([2, 4, 6, 8])
    })
  })

  describe("fromMaps", () => {
    it("converts map values to array with x2 transform", () => {
      const map = new Map([
        ["a", 1],
        ["b", 2]
      ])
      expect(array(map, x2)).toEqual([2, 4])
    })
  })

  describe("fromSets", () => {
    it("converts set to array", () => {
      expect(array(new Set([1, 2]))).toEqual([1, 2])
    })

    it("transforms set values with x2", () => {
      expect(array(new Set([1, 2]), x2)).toEqual([2, 4])
    })

    it("filters and transforms set values", () => {
      expect(array(new Set([1, 2, 3, 4]), { with: x2, when: even })).toEqual([4, 8])
    })
  })
})