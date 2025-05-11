import { describe } from "vitest"
import { testComprehension, even } from "./testLib"
import { find } from "../Comprehensions"

const source = [1, 2, 9, 4, 5]
const generate3 = () => [1, 2, 3]

describe("Find comprehensions", () => {
  // fromArray
  testComprehension(1, find, source)
  testComprehension(2, find, source, { when: even })
  testComprehension(90, find, source, v => v % 3 === 0 ? v * 10 : undefined)
  testComprehension(45, find, source, { when: v => v % 3 === 0, with: v => v * 5 })

  // fromObject
  testComprehension(2, find, { a: 1, b: 2 }, { when: even })
  testComprehension(90, find, { a: 1, b: 2, c: 9, d: 9, e: 4 }, v => v % 3 === 0 ? v * 10 : undefined)
  testComprehension(45, find, { a: 1, b: 2, c: 9, d: 9, e: 4 }, { when: v => v % 3 === 0, with: v => v * 5 })

  // fromIterables
  testComprehension(2, find, new Map([['a', 1], ['b', 2], ['c', 3]]), { when: even })
  testComprehension(1, find, new Set([1, 2]))
  testComprehension(2, find, generate3(), { when: even })
})
