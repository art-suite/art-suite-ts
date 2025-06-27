import { describe, it, expect } from 'vitest'
import { insertIntoArray, arrayWithInsertedAt, arrayWith, peek, arrayHasItems, arrayItemCount } from '../ArrayLib'

describe('ArrayLib', () => {
  describe('insertIntoArray', () => {
    it('inserts item at positive index', () => {
      const arr = [1, 2, 3]
      const result = insertIntoArray(arr, 1, 4)
      expect(result).toBe(arr) // should return same array reference
      expect(result).toEqual([1, 4, 2, 3])
    })

    it('inserts item at negative index', () => {
      const arr = [1, 2, 3]
      const result = insertIntoArray(arr, -1, 4)
      expect(result).toBe(arr)
      expect(result).toEqual([1, 2, 3, 4])
    })

    it('inserts item at end when index equals length', () => {
      const arr = [1, 2, 3]
      const result = insertIntoArray(arr, 3, 4)
      expect(result).toBe(arr)
      expect(result).toEqual([1, 2, 3, 4])
    })

    it('mutates the original array', () => {
      const arr = [1, 2, 3]
      insertIntoArray(arr, 1, 4)
      expect(arr).toEqual([1, 4, 2, 3])
    })

    it('returns new array with item when inputArray is undefined', () => {
      const result = insertIntoArray(undefined, 0, 42)
      expect(result).toEqual([42])
      expect(Array.isArray(result)).toBe(true)
    })

    it('returns new array with item when inputArray is undefined regardless of index', () => {
      const result1 = insertIntoArray(undefined, 5, 42)
      const result2 = insertIntoArray(undefined, -1, 42)
      const result3 = insertIntoArray(undefined, 100, 42)

      expect(result1).toEqual([42])
      expect(result2).toEqual([42])
      expect(result3).toEqual([42])
    })
  })

  describe('arrayWithInsertedAt', () => {
    it('inserts item at positive index', () => {
      const arr = [1, 2, 3]
      const result = arrayWithInsertedAt(arr, 1, 4)
      expect(result).not.toBe(arr) // should return new array
      expect(result).toEqual([1, 4, 2, 3])
      expect(arr).toEqual([1, 2, 3]) // original should be unchanged
    })

    it('inserts item at negative index', () => {
      const arr = [1, 2, 3]
      const result = arrayWithInsertedAt(arr, -1, 4)
      expect(result).not.toBe(arr)
      expect(result).toEqual([1, 2, 3, 4])
      expect(arr).toEqual([1, 2, 3])
    })

    it('inserts item at end when index equals length', () => {
      const arr = [1, 2, 3]
      const result = arrayWithInsertedAt(arr, 3, 4)
      expect(result).not.toBe(arr)
      expect(result).toEqual([1, 2, 3, 4])
      expect(arr).toEqual([1, 2, 3])
    })

    it('preserves original array', () => {
      const arr = [1, 2, 3]
      arrayWithInsertedAt(arr, 1, 4)
      expect(arr).toEqual([1, 2, 3])
    })

    it('returns new array with item when inputArray is undefined', () => {
      const result = arrayWithInsertedAt(undefined, 0, 42)
      expect(result).toEqual([42])
      expect(Array.isArray(result)).toBe(true)
    })

    it('returns new array with item when inputArray is undefined regardless of index', () => {
      const result1 = arrayWithInsertedAt(undefined, 5, 42)
      const result2 = arrayWithInsertedAt(undefined, -1, 42)
      const result3 = arrayWithInsertedAt(undefined, 100, 42)

      expect(result1).toEqual([42])
      expect(result2).toEqual([42])
      expect(result3).toEqual([42])
    })
  })

  describe('arrayWith', () => {
    it('should concatenate arrays', () => {
      const arr1 = [1, 2]
      const result = arrayWith(arr1, 3, 4)
      expect(result).toEqual([1, 2, 3, 4])
    })

    it('returns items array when inputArray is undefined', () => {
      const result = arrayWith(undefined, 1, 2, 3)
      expect(result).toEqual([1, 2, 3])
      expect(Array.isArray(result)).toBe(true)
    })

    it('returns empty array when inputArray is undefined and no items provided', () => {
      const result = arrayWith(undefined)
      expect(result).toEqual([])
      expect(Array.isArray(result)).toBe(true)
    })

    it('returns single item array when inputArray is undefined and one item provided', () => {
      const result = arrayWith(undefined, 42)
      expect(result).toEqual([42])
      expect(Array.isArray(result)).toBe(true)
    })

    it('handles mixed types when inputArray is undefined', () => {
      const result = arrayWith<unknown>(undefined, 'string', 42, true, null)
      expect(result).toEqual(['string', 42, true, null])
    })
  })

  describe('peek', () => {
    it('returns undefined for empty array', () => {
      expect(peek([])).toBeUndefined()
    })

    it('returns undefined for undefined array', () => {
      expect(peek(undefined)).toBeUndefined()
    })

    it('returns undefined for null array', () => {
      expect(peek(null)).toBeUndefined()
    })

    it('returns last element for non-empty array', () => {
      expect(peek([1, 2, 3])).toBe(3)
    })

    it('returns last element for single element array', () => {
      expect(peek([42])).toBe(42)
    })

    it('returns last element for array with mixed types', () => {
      expect(peek([1, 'string', true, null])).toBe(null)
    })

    it('returns last element for array with undefined values', () => {
      expect(peek([1, undefined, 3])).toBe(3)
    })

    it('returns undefined when last element is undefined', () => {
      expect(peek([1, 2, undefined])).toBeUndefined()
    })
  })

  describe('arrayHasItems', () => {
    it('returns false for empty array', () => {
      expect(arrayHasItems([])).toBe(false)
    })

    it('returns false for undefined array', () => {
      expect(arrayHasItems(undefined)).toBe(false)
    })

    it('returns false for null array', () => {
      expect(arrayHasItems(null)).toBe(false)
    })

    it('returns true for array with one item', () => {
      expect(arrayHasItems([42])).toBe(true)
    })

    it('returns true for array with multiple items', () => {
      expect(arrayHasItems([1, 2, 3])).toBe(true)
    })

    it('returns true for array with undefined values', () => {
      expect(arrayHasItems([undefined, null, 0])).toBe(true)
    })

    it('returns true for array with empty strings', () => {
      expect(arrayHasItems(['', 'hello'])).toBe(true)
    })

    it('returns true for array with zero values', () => {
      expect(arrayHasItems([0, 1, 2])).toBe(true)
    })

    it('returns true for array with false values', () => {
      expect(arrayHasItems([false, true])).toBe(true)
    })
  })

  describe('arrayItemCount', () => {
    it('returns 0 for empty array', () => {
      expect(arrayItemCount([])).toBe(0)
    })

    it('returns 0 for undefined array', () => {
      expect(arrayItemCount(undefined)).toBe(0)
    })

    it('returns 0 for null array', () => {
      expect(arrayItemCount(null)).toBe(0)
    })

    it('returns 1 for array with one item', () => {
      expect(arrayItemCount([42])).toBe(1)
    })

    it('returns correct count for array with multiple items', () => {
      expect(arrayItemCount([1, 2, 3])).toBe(3)
    })

    it('returns correct count for array with many items', () => {
      expect(arrayItemCount([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(10)
    })

    it('returns correct count for array with undefined values', () => {
      expect(arrayItemCount([undefined, null, 0])).toBe(3)
    })

    it('returns correct count for array with empty strings', () => {
      expect(arrayItemCount(['', 'hello', 'world'])).toBe(3)
    })

    it('returns correct count for array with zero values', () => {
      expect(arrayItemCount([0, 1, 2, 3, 4])).toBe(5)
    })

    it('returns correct count for array with false values', () => {
      expect(arrayItemCount([false, true, false])).toBe(3)
    })

    it('returns correct count for array with mixed types', () => {
      expect(arrayItemCount([1, 'string', true, null, undefined, 0])).toBe(6)
    })
  })
})