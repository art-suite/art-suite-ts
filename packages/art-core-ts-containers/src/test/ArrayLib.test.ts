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
  })

  describe('arrayWith', () => {
    it('should concatenate arrays', () => {
      const arr1 = [1, 2]
      const result = arrayWith(arr1, 3, 4)
      expect(result).toEqual([1, 2, 3, 4])
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
  })
})