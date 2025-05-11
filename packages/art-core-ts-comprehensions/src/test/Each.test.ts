import { describe, it, expect } from "vitest"
import { testComprehension } from "./testLib"
import { each } from "../Comprehensions"

describe("Each comprehensions", () => {
  // Basic null/undefined tests
  testComprehension(undefined, each, undefined)
  testComprehension(undefined, each, null)
  testComprehension(null, each, null, { into: null })
  testComprehension(null, each, null, { inject: null })
  testComprehension(null, each, null, { returning: null })

  // Array iteration test
  it("each [1 2 3]", () => {
    let count = 0
    each([1, 2, 3], (v, k) => count++)
    expect(count).toBe(3)
  })

  // Object iteration test
  it("each {a:1 b:2 c:3}", () => {
    let count = 0
    each({ a: 1, b: 2, c: 3 }, (v, k) => count++)
    expect(count).toBe(3)
  })

  // stopWhen test
  it("stopWhen", () => {
    let acc: any[] = []
    each(
      [1, 2, 3],
      { with: (v) => acc.push(v * 3), stopWhen: (v) => v > 2 }
    )
    expect(acc).toEqual([3, 6])
  })
})
