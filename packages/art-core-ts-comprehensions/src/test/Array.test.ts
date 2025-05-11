import { describe, it, expect } from "vitest"
import { testComprehension, x2, even } from "./testLib"
import { array } from "../Comprehensions"

describe("Array comprehensions", () => {
  // Basic array operations
  testComprehension([], array, null)
  testComprehension([], array, [])
  testComprehension([2, 4], array, { a: 1, b: 2 }, x2)
  testComprehension([2, 4, 6, 8], array, [1, 2, 3, 4], x2)
  testComprehension([4, 8], array, [1, 2, 3, 4], { with: x2, when: even })
  testComprehension([2, 4, 6, 8], array, [1, 2, 3, 4], { with: x2 })

  // Map operations
  const map = new Map([
    ["a", 1],
    ["b", 2]
  ])
  testComprehension([2, 4], array, map, x2)
})