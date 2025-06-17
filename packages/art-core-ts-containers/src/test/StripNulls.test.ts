import { describe, it, expect } from "vitest"
import { stripNulls, deepStripNulls, deepStripNullish, stripNullish } from "../index"

describe("stripNulls", () => {
  it("should shallowly strip nulls from objects", () => {
    const input = {
      a: 1,
      b: null,
      c: {
        d: null,
        e: 2
      }
    }
    const expected = {
      a: 1,
      c: {
        d: null,
        e: 2
      }
    }
    expect(stripNulls(input)).toEqual(expected)
  })

  it("should shallowly strip nulls from arrays", () => {
    const input = [1, null, 2, { a: null }, 3]
    const expected = [1, 2, { a: null }, 3]
    expect(stripNulls(input)).toEqual(expected)
  })

  it("should handle null input", () => {
    expect(stripNulls(null)).toBe(null)
    expect(stripNulls(undefined)).toBe(undefined)
  })

  it("should preserve non-object primitives", () => {
    expect(stripNulls(123)).toBe(123)
    expect(stripNulls("string")).toBe("string")
    expect(stripNulls(true)).toBe(true)
  })

  it("should preserve Date and RegExp instances", () => {
    const date = new Date()
    const regex = /test/
    expect(stripNulls(date)).toBe(date)
    expect(stripNulls(regex)).toBe(regex)
  })
})

describe("deepStripNulls", () => {
  it("should deeply strip nulls from objects", () => {
    const input = {
      a: 1,
      b: null,
      c: {
        d: null,
        e: 2,
        f: {
          g: null,
          h: 3
        }
      }
    }
    const expected = {
      a: 1,
      c: {
        e: 2,
        f: {
          h: 3
        }
      }
    }
    expect(deepStripNulls(input)).toEqual(expected)
  })

  it("should deeply strip nulls from arrays", () => {
    const input = [1, null, 2, { a: null, b: { c: null, d: 1 } }, 3]
    const expected = [1, 2, { b: { d: 1 } }, 3]
    expect(deepStripNulls(input)).toEqual(expected)
  })

  it("should handle null input", () => {
    expect(deepStripNulls(null)).toBeUndefined()
  })

  it("should preserve non-object primitives", () => {
    expect(deepStripNulls(123)).toBe(123)
    expect(deepStripNulls("string")).toBe("string")
    expect(deepStripNulls(true)).toBe(true)
  })

  it("should preserve Date and RegExp instances", () => {
    const date = new Date()
    const regex = /test/
    expect(deepStripNulls(date)).toBe(date)
    expect(deepStripNulls(regex)).toBe(regex)
  })

  it("should handle nested arrays", () => {
    const input = [1, [null, 2, [null, 3]], null, 4]
    const expected = [1, [2, [3]], 4]
    expect(deepStripNulls(input)).toEqual(expected)
  })

  it("should handle complex nested structures", () => {
    const input = {
      a: [1, null, 2],
      b: null,
      c: {
        d: {
          e: null,
          f: [null, 1, { g: null, h: 2 }]
        },
        i: null
      }
    }
    const expected = {
      a: [1, 2],
      c: {
        d: {
          f: [1, { h: 2 }]
        }
      }
    }
    expect(deepStripNulls(input)).toEqual(expected)
  })
})

// deepStripNullish
describe("deepStripNullish", () => {
  it("should deeply strip nulls and undefined from objects", () => {
    const input = {
      a: 1,
      b: null,
      c: {
        d: null,
        e: 2,
        f: {
          g: null,
          h: undefined
        }
      }
    }
    const expected = {
      a: 1,
      c: {
        e: 2,
        f: {
        }
      }
    }
    expect(deepStripNullish(input)).toEqual(expected)
  })

  //now with arrays
  it("should deeply strip nulls and undefined from arrays", () => {
    const input = [1, null, 2, [null, 3], { a: null, b: { c: null, d: 1 } }, 3]
    const expected = [1, 2, [3], { b: { d: 1 } }, 3]
    expect(deepStripNullish(input)).toEqual(expected)
  })

})

// stripNullish is NOT deep, it's shallow
describe("stripNullish", () => {
  it("should strip nulls and undefined from objects", () => {
    const input = {
      a: 1,
      b: null,
      c: {
        d: null,
        e: 2,
        f: {
          g: null,
          h: undefined
        }
      }
    }
    const expected = {
      a: 1,
      c: {
        d: null,
        e: 2,
        f: {
          g: null,
          h: undefined
        }
      }
    }
    expect(stripNullish(input)).toEqual(expected)
  })

  //now with arrays
  it("should strip nulls and undefined from arrays", () => {
    const input = [1, null, 2, [null, 3], { a: null, b: { c: null, d: 1 } }, 3]
    const expected = [1, 2, [null, 3], { a: null, b: { c: null, d: 1 } }, 3]
    expect(stripNullish(input)).toEqual(expected)
  })

  // now any other type just returns the input
  it("should return the input for any other type", () => {
    expect(stripNullish(1)).toBe(1)
    expect(stripNullish("string")).toBe("string")
    expect(stripNullish(true)).toBe(true)

    const date = new Date()
    const regex = /test/
    expect(stripNullish(date)).toBe(date)
    expect(stripNullish(regex)).toBe(regex)
  })
})