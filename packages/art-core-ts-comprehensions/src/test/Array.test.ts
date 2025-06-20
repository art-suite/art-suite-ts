import { describe, it, expect } from "vitest"
import { x2, even } from "./testLib"
import { array } from "../Comprehensions"

describe("Array comprehensions", () => {
  describe("super basic", () => {
    it("handles null input", () => {
      expect(array([1, 2], v => v * 2)).toEqual([2, 4])
    })
  })

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

    it("stops when stopWhen is true", () => {
      expect(array([1, 2, 3, 4], { with: x2, stopWhen: v => v === 3 })).toEqual([2, 4])
    })

    it("combines when and stopWhen", () => {
      expect(array([1, 2, 3, 4], { with: x2, when: even, stopWhen: v => v === 3 })).toEqual([4])
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

  describe("fromGenerators", () => {
    it("converts generator sequence to array", () => {
      const countdown = function* () {
        yield 4
        yield 3
        yield 2
        yield 1
      }
      expect(array(countdown())).toEqual([4, 3, 2, 1])
    })

    it("transforms generator values with x2", () => {
      const countdown = function* () {
        yield 4
        yield 3
        yield 2
        yield 1
      }
      expect(array(countdown(), x2)).toEqual([8, 6, 4, 2])
    })

    it("filters and transforms generator values", () => {
      const countdown = function* () {
        yield 4
        yield 3
        yield 2
        yield 1
      }
      expect(array(countdown(), { with: x2, when: even })).toEqual([8, 4])
    })
  })

  describe("error cases", () => {
    it("throws error for non-iterable custom class", () => {
      class NonIterable {
        value: number
        constructor(value: number) {
          this.value = value
        }
      }
      expect(() => array((new NonIterable(42)) as any)).toThrow()
    })
  })
})