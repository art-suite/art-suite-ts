import { describe, it, expect } from "vitest"
import { even } from "./testLib"
import { find } from "../Comprehensions"

describe("Find comprehensions", () => {
  describe("fromArrays", () => {
    it("finds first element", () => {
      expect(find([1, 2, 9, 4, 5])).toBe(1)
    })

    it("finds first even number", () => {
      expect(find([1, 2, 9, 4, 5], { when: even })).toBe(2)
    })

    it("finds and transforms first multiple of 3", () => {
      expect(find([1, 2, 9, 4, 5], v => v % 3 === 0 ? v * 10 : undefined)).toBe(90)
    })

    it("finds and transforms first multiple of 3 with options", () => {
      expect(find([1, 2, 9, 4, 5], { when: v => v % 3 === 0, with: v => v * 5 })).toBe(45)
    })
  })

  describe("fromObjects", () => {
    it("finds first even value", () => {
      expect(find({ a: 1, b: 2 }, { when: even })).toBe(2)
    })

    it("finds and transforms first multiple of 3", () => {
      expect(find({ a: 1, b: 2, c: 9, d: 9, e: 4 }, v => v % 3 === 0 ? v * 10 : undefined)).toBe(90)
    })

    it("finds and transforms first multiple of 3 with options", () => {
      expect(find({ a: 1, b: 2, c: 9, d: 9, e: 4 }, { when: v => v % 3 === 0, with: v => v * 5 })).toBe(45)
    })
  })

  describe("fromIterables", () => {
    it("finds first even value from map", () => {
      const map = new Map([['a', 1], ['b', 2], ['c', 3]])
      expect(find(map, { when: even })).toBe(2)
    })

    it("finds first value from set", () => {
      expect(find(new Set([1, 2]))).toBe(1)
    })

    it("finds first even value from generator", () => {
      const generate3 = () => [1, 2, 3]
      expect(find(generate3(), { when: even })).toBe(2)
    })
  })
})
