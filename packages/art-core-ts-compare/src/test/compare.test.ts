import { describe, it, expect } from 'vitest'
import { compare } from '../compare'

describe('compare', () => {
  describe('primitives', () => {
    it('should compare numbers using subtraction', () => {
      expect(compare(5, 10)).toBe(-5)
      expect(compare(10, 5)).toBe(5)
      expect(compare(5, 5)).toBe(0)
    })

    it('should compare strings using localeCompare', () => {
      expect(compare('a', 'z')).toBe(-1)
      expect(compare('z', 'a')).toBe(1)
      expect(compare('a', 'a')).toBe(0)
    })

    it('should compare booleans using number conversion', () => {
      expect(compare(false, true)).toBe(-1)
      expect(compare(true, false)).toBe(1)
      expect(compare(true, true)).toBe(0)
      expect(compare(false, false)).toBe(0)
    })

    it('should handle null', () => {
      expect(compare(null, 0)).toBe(-1)
      expect(compare(0, null)).toBe(1)
      expect(compare(null, null)).toBe(0)
    })

    it('should handle undefined', () => {
      expect(compare(undefined, null)).toBe(1)
      expect(compare(null, undefined)).toBe(-1)
      expect(compare(undefined, 0)).toBe(1)
      expect(compare(0, undefined)).toBe(-1)
      expect(compare(undefined, undefined)).toBe(0)
    })

    it('should handle NaN', () => {
      expect(compare(NaN, NaN)).toBe(0)
      expect(compare(NaN, 0)).toBe(-1)
      expect(compare(0, NaN)).toBe(1)
    })

    it('should return NaN for different primitive types', () => {
      expect(compare(5, "hello")).toBeNaN()
      expect(compare("hello", 5)).toBeNaN()
      expect(compare(true, 42)).toBeNaN()
      expect(compare(42, true)).toBeNaN()
      expect(compare("hello", true)).toBeNaN()
      expect(compare(true, "hello")).toBeNaN()
      expect(compare(null, "hello")).toBe(-1) // null is less than strings
      expect(compare(undefined, "hello")).toBe(1) // undefined is greater than strings
    })
  })

  describe('arrays', () => {
    it('should compare arrays element by element', () => {
      expect(compare([1, 2], [1, 2, 3])).toBe(-1)
      expect(compare([1, 2, 3], [1, 2])).toBe(1)
      expect(compare([1, 2], [1, 2])).toBe(0)
    })

    it('should handle nested arrays', () => {
      expect(compare([[1, 2], [3]], [[1, 2], [3, 4]])).toBe(-1)
      expect(compare([[1, 2], [3, 4]], [[1, 2], [3]])).toBe(1)
    })

    it('should handle mixed content arrays', () => {
      expect(compare([1, 'a', true], [1, 'a', false])).toBe(1)
      expect(compare([1, 'a', false], [1, 'a', true])).toBe(-1)
    })

    it('should return NaN for arrays with incompatible elements', () => {
      expect(compare([1, 2], [1, "hello"])).toBeNaN()
      expect(compare([1, "hello"], [1, 2])).toBeNaN()
    })
  })

  describe('plain objects', () => {
    it('should compare objects by sorted keys', () => {
      expect(compare({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(0)
      expect(compare({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(-1)
      expect(compare({ a: 1, b: 3 }, { a: 1, b: 2 })).toBe(1)
    })

    it('should handle different key orders', () => {
      expect(compare({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(0)
    })

    it('should handle objects with different key sets', () => {
      expect(compare({ a: 1 }, { a: 1, b: 2 })).toBe(-1)
      expect(compare({ a: 1, b: 2 }, { a: 1 })).toBe(1)
      expect(compare({}, { a: 0 })).toBe(-1)
      expect(compare({ a: 0 }, {})).toBe(1)
      expect(compare({}, { a: '' })).toBe(-1)
      expect(compare({ a: '' }, {})).toBe(1)
      expect(compare({}, { a: false })).toBe(-1)
      expect(compare({ a: false }, {})).toBe(1)
      expect(compare({}, { a: undefined })).toBe(-1)
      expect(compare({ a: undefined }, {})).toBe(1)
      expect(compare({}, { a: null })).toBe(-1)
      expect(compare({ a: null }, {})).toBe(1)
    })

    it('should handle nested objects', () => {
      expect(compare({ a: { x: 1 } }, { a: { x: 2 } })).toBe(-1)
      expect(compare({ a: { x: 2 } }, { a: { x: 1 } })).toBe(1)
    })

    it('should return NaN for objects with incompatible values', () => {
      expect(compare({ a: 1 }, { a: "hello" })).toBeNaN()
      expect(compare({ a: "hello" }, { a: 1 })).toBeNaN()
    })

    it('should compare objects using merged unique keys', () => {
      // Objects with different keys - should compare by first differing key
      expect(compare({ a: 1, c: 3 }, { a: 1, b: 2 })).toBe(1) // ['a', 'c'] > ['a', 'b']
      expect(compare({ a: 1, b: 2 }, { a: 1, c: 3 })).toBe(-1) // ['a', 'b'] < ['a', 'c']

      // Objects with same keys but different values
      expect(compare({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(-1) // b: 2 < b: 3
      expect(compare({ a: 1, b: 3 }, { a: 1, b: 2 })).toBe(1) // b: 3 > b: 2

      // order of keys should not matter if they are the same
      expect(compare({ b: 3, a: 1 }, { a: 1, b: 2 })).toBe(1) // b: 3 > b: 2
      expect(compare({ a: 1, b: 3 }, { b: 2, a: 1 })).toBe(1) // b: 3 > b: 2

      // different keys takes precedence over different values
      expect(compare({ a: 1, b: 3 }, { a: 1, b: 2, c: 4 })).toBe(-1) // b: 3 > b: 2
      expect(compare({ a: 1, b: 3, c: 4 }, { a: 1, b: 2 })).toBe(1) // b: 3 > b: 2

      // Objects with completely different keys
      expect(compare({ x: 1 }, { y: 1 })).toBe(-1) // ['x'] < ['y']
      expect(compare({ y: 1 }, { x: 1 })).toBe(1) // ['y'] > ['x']
      // Test missing key is always less, even if present value is empty/false/0/null/undefined
      expect(compare({}, { a: 0 })).toBe(-1)
      expect(compare({}, { a: '' })).toBe(-1)
      expect(compare({}, { a: false })).toBe(-1)
      expect(compare({}, { a: null })).toBe(-1)
      expect(compare({}, { a: undefined })).toBe(-1)
    })
  })

  describe('custom comparables', () => {
    it('should use compare method when available', () => {
      class Box {
        constructor(public value: number) { }
        compare(other: any): number {
          if (!(other instanceof Box)) return 0 // Return 0 to indicate no comparison
          return this.value - other.value
        }
      }

      expect(compare(new Box(2), new Box(5))).toBe(-3)
      expect(compare(new Box(5), new Box(2))).toBe(3)
      expect(compare(new Box(2), new Box(2))).toBe(0)
    })

    it('should use eq method when compare is not available', () => {
      class Tag {
        constructor(public name: string) { }
        eq(other: any): boolean {
          return other instanceof Tag && other.name === this.name
        }
      }

      expect(compare(new Tag('a'), new Tag('a'))).toBe(0)
      expect(compare(new Tag('a'), new Tag('b'))).toBeNaN() // eq returns false, so no comparison
    })

    it('should prioritize compare over eq', () => {
      class Test {
        constructor(public value: number) { }
        compare(other: any): number {
          return this.value - other.value
        }
        eq(other: any): boolean {
          return this.value === other.value
        }
      }

      expect(compare(new Test(2), new Test(5))).toBe(-3) // uses compare, not eq
    })

    it('should use inequality methods when compare is not available', () => {
      class Test {
        constructor(public value: number) { }
        lt(other: any): boolean {
          return other instanceof Test && this.value < other.value
        }
        gt(other: any): boolean {
          return other instanceof Test && this.value > other.value
        }
      }

      expect(compare(new Test(2), new Test(5))).toBe(-1) // uses lt
      expect(compare(new Test(5), new Test(2))).toBe(1)  // uses gt
      expect(compare(new Test(2), new Test(2))).toBeNaN() // neither lt nor gt returns true
    })

    it('should prioritize compare over inequality methods', () => {
      class Test {
        constructor(public value: number) { }
        compare(other: any): number {
          return this.value - other.value
        }
        lt(other: any): boolean {
          return other instanceof Test && this.value < other.value
        }
        gt(other: any): boolean {
          return other instanceof Test && this.value > other.value
        }
      }

      expect(compare(new Test(2), new Test(5))).toBe(-3) // uses compare, not lt/gt
    })

    it('should prioritize inequality methods over eq', () => {
      class Test {
        constructor(public value: number) { }
        lt(other: any): boolean {
          return other instanceof Test && this.value < other.value
        }
        gt(other: any): boolean {
          return other instanceof Test && this.value > other.value
        }
        eq(other: any): boolean {
          return this.value === other.value
        }
      }

      expect(compare(new Test(2), new Test(5))).toBe(-1) // uses lt, not eq
    })
  })

  describe('mixed types', () => {
    it('should handle mixed type comparisons', () => {
      expect(compare(null, 0)).toBe(-1)
      expect(compare(0, null)).toBe(1)
      expect(compare(undefined, 0)).toBe(1)
      expect(compare(0, undefined)).toBe(-1)
    })

    it('should return NaN for incompatible mixed types', () => {
      expect(compare(5, "hello")).toBeNaN()
      expect(compare(true, 42)).toBeNaN()
      expect(compare(() => { }, {})).toBeNaN()
      expect(compare(Symbol('a'), "hello")).toBeNaN()
    })
  })

  describe('edge cases', () => {
    it('should handle empty arrays and objects', () => {
      expect(compare([], [])).toBe(0)
      expect(compare({}, {})).toBe(0)
      expect(compare([], [1])).toBe(-1)
      expect(compare([1], [])).toBe(1)
    })

    it('should handle complex nested structures', () => {
      const obj1 = { a: [1, { x: 2 }], b: 3 }
      const obj2 = { a: [1, { x: 2 }], b: 3 }
      const obj3 = { a: [1, { x: 3 }], b: 3 }

      expect(compare(obj1, obj2)).toBe(0)
      expect(compare(obj1, obj3)).toBe(-1)
      expect(compare(obj3, obj1)).toBe(1)
    })

    it('should handle functions and symbols', () => {
      expect(compare(() => { }, () => { })).toBeNaN()
      expect(compare(Symbol('a'), Symbol('b'))).toBeNaN()
      expect(compare(() => { }, {})).toBeNaN()
    })
  })
})