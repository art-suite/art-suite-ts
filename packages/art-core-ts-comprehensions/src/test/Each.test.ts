import { describe, it, expect } from "vitest"
import { each } from "../Comprehensions"

describe("Each comprehensions", () => {
  describe("null/undefined handling", () => {
    it("returns undefined for undefined input", () => {
      expect(each(undefined)).toBeUndefined()
    })

    it("returns undefined for null input", () => {
      expect(each(null)).toBeUndefined()
    })

    it("returns null when returning is null", () => {
      expect(each(null, { returning: null })).toBeNull()
    })
  })

  describe("array iteration", () => {
    it("iterates over array elements", () => {
      let count = 0
      each([1, 2, 3], (v, k) => count++)
      expect(count).toBe(3)
    })

    it("stops iteration when stopWhen is true", () => {
      let acc: any[] = []
      each(
        [1, 2, 3],
        { with: (v) => acc.push(v * 3), stopWhen: (v) => v > 2 }
      )
      expect(acc).toEqual([3, 6])
    })
  })

  describe("object iteration", () => {
    it("iterates over object entries", () => {
      let count = 0
      each({ a: 1, b: 2, c: 3 }, (v, k) => count++)
      expect(count).toBe(3)
    })
  })

  describe("iterable iteration", () => {
    it("iterates over map entries", () => {
      let count = 0
      const map = new Map([['a', 1], ['b', 2], ['c', 3]])
      each(map, (v, k) => count++)
      expect(count).toBe(3)
    })

    it("iterates over set values", () => {
      let count = 0
      each(new Set([1, 2, 3]), (v, k) => count++)
      expect(count).toBe(3)
    })
  })
})
