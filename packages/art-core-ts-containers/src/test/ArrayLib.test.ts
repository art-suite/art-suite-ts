import { describe, it, expect } from 'vitest'
import { insertIntoArray, arrayWithInsertedAt, arrayWith, peek } from '../ArrayLib'

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
})