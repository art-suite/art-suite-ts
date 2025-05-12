import { describe, it, expect } from 'vitest'
import {
  isObject,
  isPlainObject,
  isFunction,
  isNumber,
  isString,
  isArrayBuffer,
  isArray,
  isPromise,
  isRegExp,
  isError,
  isDate,
  isEmptyObject,
  isBoolean,
  isTypedArray,
  isNonNegativeInt,
  stringIsPresent,
  exists,
  doesNotExist,
  isNull,
  isNotNull,
  isUndefined,
  isNotUndefined,
  isNullish,
  isNotNullish,
  present
} from '../Types'

describe('Type checking functions', () => {
  describe('isObject', () => {
    it('returns true for plain objects', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ a: 1 })).toBe(true)
    })

    it('returns true for arrays', () => {
      expect(isObject([])).toBe(true)
      expect(isObject([1, 2, 3])).toBe(true)
    })

    it('returns false for primitives', () => {
      expect(isObject(null)).toBe(false)
      expect(isObject(undefined)).toBe(false)
      expect(isObject('string')).toBe(false)
      expect(isObject(123)).toBe(false)
      expect(isObject(true)).toBe(false)
    })
  })

  describe('isPlainObject', () => {
    it('returns true for plain objects', () => {
      expect(isPlainObject({})).toBe(true)
      expect(isPlainObject({ a: 1 })).toBe(true)
    })

    it('returns false for arrays and other objects', () => {
      expect(isPlainObject([])).toBe(false)
      expect(isPlainObject(new Date())).toBe(false)
      expect(isPlainObject(new Error())).toBe(false)
    })
  })

  describe('isFunction', () => {
    it('returns true for functions', () => {
      expect(isFunction(() => { })).toBe(true)
      expect(isFunction(function () { })).toBe(true)
    })

    it('returns false for non-functions', () => {
      expect(isFunction({})).toBe(false)
      expect(isFunction([])).toBe(false)
      expect(isFunction('string')).toBe(false)
    })
  })

  describe('isNumber', () => {
    it('returns true for numbers', () => {
      expect(isNumber(123)).toBe(true)
      expect(isNumber(0)).toBe(true)
      expect(isNumber(-1)).toBe(true)
      expect(isNumber(1.23)).toBe(true)
    })

    it('returns false for non-numbers', () => {
      expect(isNumber('123')).toBe(false)
      expect(isNumber(null)).toBe(false)
      expect(isNumber(undefined)).toBe(false)
    })
  })

  describe('isString', () => {
    it('returns true for strings', () => {
      expect(isString('')).toBe(true)
      expect(isString('hello')).toBe(true)
    })

    it('returns false for non-strings', () => {
      expect(isString(123)).toBe(false)
      expect(isString(null)).toBe(false)
      expect(isString(undefined)).toBe(false)
    })
  })

  describe('isArrayBuffer', () => {
    it('returns true for ArrayBuffer', () => {
      expect(isArrayBuffer(new ArrayBuffer(8))).toBe(true)
    })

    it('returns false for non-ArrayBuffer', () => {
      expect(isArrayBuffer([])).toBe(false)
      expect(isArrayBuffer({})).toBe(false)
    })
  })

  describe('isArray', () => {
    it('returns true for arrays', () => {
      expect(isArray([])).toBe(true)
      expect(isArray([1, 2, 3])).toBe(true)
    })

    it('returns false for non-arrays', () => {
      expect(isArray({})).toBe(false)
      expect(isArray('array')).toBe(false)
    })
  })

  describe('isPromise', () => {
    it('returns true for promises', () => {
      expect(isPromise(Promise.resolve())).toBe(true)
      expect(isPromise(new Promise(() => { }))).toBe(true)
    })

    it('returns false for non-promises', () => {
      expect(isPromise({ then: () => { } })).toBe(true)
      expect(isPromise({})).toBe(false)
    })
  })

  describe('isRegExp', () => {
    it('returns true for RegExp objects', () => {
      expect(isRegExp(/regex/)).toBe(true)
      expect(isRegExp(new RegExp('regex'))).toBe(true)
    })

    it('returns false for non-RegExp objects', () => {
      expect(isRegExp('regex')).toBe(false)
      expect(isRegExp({})).toBe(false)
    })
  })

  describe('isError', () => {
    it('returns true for Error objects', () => {
      expect(isError(new Error())).toBe(true)
      expect(isError(new TypeError())).toBe(true)
    })

    it('returns false for non-Error objects', () => {
      expect(isError({})).toBe(false)
      expect(isError('error')).toBe(false)
    })
  })

  describe('isDate', () => {
    it('returns true for Date objects', () => {
      expect(isDate(new Date())).toBe(true)
    })

    it('returns false for non-Date objects', () => {
      expect(isDate('2024-01-01')).toBe(false)
      expect(isDate({})).toBe(false)
    })
  })

  describe('isEmptyObject', () => {
    it('returns true for empty objects', () => {
      expect(isEmptyObject({})).toBe(true)
    })

    it('returns false for non-empty objects', () => {
      expect(isEmptyObject({ a: 1 })).toBe(false)
    })
  })

  describe('isBoolean', () => {
    it('returns true for booleans', () => {
      expect(isBoolean(true)).toBe(true)
      expect(isBoolean(false)).toBe(true)
    })

    it('returns false for non-booleans', () => {
      expect(isBoolean(1)).toBe(false)
      expect(isBoolean('true')).toBe(false)
    })
  })

  describe('isTypedArray', () => {
    it('returns true for TypedArrays', () => {
      expect(isTypedArray(new Int8Array())).toBe(true)
      expect(isTypedArray(new Uint8Array())).toBe(true)
      expect(isTypedArray(new Float32Array())).toBe(true)
    })

    it('returns false for non-TypedArrays', () => {
      expect(isTypedArray([])).toBe(false)
      expect(isTypedArray({})).toBe(false)
    })
  })

  describe('isNonNegativeInt', () => {
    it('returns true for non-negative integers', () => {
      expect(isNonNegativeInt(0)).toBe(true)
      expect(isNonNegativeInt(1)).toBe(true)
      expect(isNonNegativeInt(42)).toBe(true)
    })

    it('returns false for negative numbers or non-integers', () => {
      expect(isNonNegativeInt(-1)).toBe(false)
      expect(isNonNegativeInt(1.5)).toBe(false)
      expect(isNonNegativeInt(-1.5)).toBe(false)
    })
  })

  describe('stringIsPresent', () => {
    it('returns true for non-empty strings', () => {
      expect(stringIsPresent('hello')).toBe(true)
      expect(stringIsPresent('  hello  ')).toBe(true)
    })

    it('returns false for empty or whitespace-only strings', () => {
      expect(stringIsPresent('')).toBe(false)
      expect(stringIsPresent('   ')).toBe(false)
      expect(stringIsPresent('\t\n')).toBe(false)
    })
  })

  describe('exists', () => {
    it('returns true for non-null/undefined values', () => {
      expect(exists(0)).toBe(true)
      expect(exists('')).toBe(true)
      expect(exists(false)).toBe(true)
      expect(exists({})).toBe(true)
    })

    it('returns false for null/undefined', () => {
      expect(exists(null)).toBe(false)
      expect(exists(undefined)).toBe(false)
    })
  })

  describe('doesNotExist', () => {
    it('returns true for null/undefined', () => {
      expect(doesNotExist(null)).toBe(true)
      expect(doesNotExist(undefined)).toBe(true)
    })

    it('returns false for non-null/undefined values', () => {
      expect(doesNotExist(0)).toBe(false)
      expect(doesNotExist('')).toBe(false)
      expect(doesNotExist(false)).toBe(false)
    })
  })

  describe('isNull', () => {
    it('returns true for null', () => {
      expect(isNull(null)).toBe(true)
    })

    it('returns false for non-null values', () => {
      expect(isNull(undefined)).toBe(false)
      expect(isNull(0)).toBe(false)
      expect(isNull('')).toBe(false)
    })
  })

  describe('isNotNull', () => {
    it('returns true for non-null values', () => {
      expect(isNotNull(undefined)).toBe(true)
      expect(isNotNull(0)).toBe(true)
      expect(isNotNull('')).toBe(true)
    })

    it('returns false for null', () => {
      expect(isNotNull(null)).toBe(false)
    })
  })

  describe('isUndefined', () => {
    it('returns true for undefined', () => {
      expect(isUndefined(undefined)).toBe(true)
    })

    it('returns false for non-undefined values', () => {
      expect(isUndefined(null)).toBe(false)
      expect(isUndefined(0)).toBe(false)
      expect(isUndefined('')).toBe(false)
    })
  })

  describe('isNotUndefined', () => {
    it('returns true for non-undefined values', () => {
      expect(isNotUndefined(null)).toBe(true)
      expect(isNotUndefined(0)).toBe(true)
      expect(isNotUndefined('')).toBe(true)
    })

    it('returns false for undefined', () => {
      expect(isNotUndefined(undefined)).toBe(false)
    })
  })

  describe('isNullish', () => {
    it('returns true for null/undefined', () => {
      expect(isNullish(null)).toBe(true)
      expect(isNullish(undefined)).toBe(true)
    })

    it('returns false for non-nullish values', () => {
      expect(isNullish(0)).toBe(false)
      expect(isNullish('')).toBe(false)
      expect(isNullish(false)).toBe(false)
    })
  })

  describe('isNotNullish', () => {
    it('returns true for non-nullish values', () => {
      expect(isNotNullish(0)).toBe(true)
      expect(isNotNullish('')).toBe(true)
      expect(isNotNullish(false)).toBe(true)
    })

    it('returns false for null/undefined', () => {
      expect(isNotNullish(null)).toBe(false)
      expect(isNotNullish(undefined)).toBe(false)
    })
  })

  describe('present', () => {
    it('returns true for non-null/undefined values', () => {
      expect(present(0)).toBe(true)
      expect(present(false)).toBe(true)
      expect(present({})).toBe(true)
    })

    it('returns false for null/undefined', () => {
      expect(present(null)).toBe(false)
      expect(present(undefined)).toBe(false)
    })

    it('returns false for empty strings', () => {
      expect(present('')).toBe(false)
      expect(present('   ')).toBe(false)
    })

    it('handles objects with getPresent method', () => {
      const obj = {
        getPresent: () => true
      }
      expect(present(obj)).toBe(true)

      const obj2 = {
        getPresent: () => false
      }
      expect(present(obj2)).toBe(false)
    })

    it('handles objects with present method', () => {
      const obj = {
        present: () => true
      }
      expect(present(obj)).toBe(true)

      const obj2 = {
        present: () => false
      }
      expect(present(obj2)).toBe(false)
    })
  })
})
