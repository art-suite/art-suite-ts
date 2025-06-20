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


describe("regression tests", () => {
  it("finds match in user list", () => {
    const TO_FIND = {
      "phoneNumber": "+12063334446",
      "id": "b6370023-3826-4a79-848b-ee54f7121c94",
      "createdAt": "2025-06-13T09:42:30.459Z"
    }
    const data = [{
      "phoneNumber": "+12063334444",
      "id": "9bcfe044-344c-4416-aa02-5044506b2892",
      "createdAt": "2025-06-17T13:57:54.293Z"
    },
    {
      "phoneNumber": "+12063334445",
      "id": "6896856a-92c5-45cf-8cff-03dfc5499e66",
      "createdAt": "2025-06-19T13:40:23.657Z"
    },
      TO_FIND,
    {
      "phoneNumber": "+12063334447",
      "id": "617f0d48-9599-4fa2-adec-2b15595a2ba8",
      "createdAt": "2025-06-13T08:27:19.697Z"
    }
    ]
    expect(find(data, { when: v => v.phoneNumber === TO_FIND.phoneNumber })).toBe(TO_FIND)
  })
})