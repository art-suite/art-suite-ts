import { describe, it, expect } from 'vitest'
import { validateJsonString, validateJsonObject, validateJsonBoolean, validateJsonNumber, validateOptionalJsonString, validateOptionalJsonObject, validateOptionalJsonBoolean, validateOptionalJsonNumber, validateJsonArray } from '../validateJson'
import { JsonValue } from '../JsonTypes'

describe('validateJsonString', () => {
  // Basic string validation
  it('accepts valid JSON strings', () => {
    expect(validateJsonString('hello')).toBe('hello')
    expect(validateJsonString('')).toBe('')
    expect(validateJsonString('123')).toBe('123')
  })

  it('rejects non-string values', () => {
    expect(() => validateJsonString(123 as JsonValue)).toThrow('Expected a JSON string')
    expect(() => validateJsonString(true as JsonValue)).toThrow('Expected a JSON string')
    expect(() => validateJsonString({} as JsonValue)).toThrow('Expected a JSON string')
    expect(() => validateJsonString([] as JsonValue)).toThrow('Expected a JSON string')
    expect(() => validateJsonString(null as JsonValue)).toThrow('Expected a JSON string')
    expect(() => validateJsonString(undefined as unknown as JsonValue)).toThrow('Expected a JSON string')
  })
})

describe('validateJsonObject', () => {
  // Basic object validation
  it('accepts valid JSON objects', () => {
    expect(validateJsonObject({})).toEqual({})
    expect(validateJsonObject({ a: 1 })).toEqual({ a: 1 })
    expect(validateJsonObject({ a: { b: 2 } })).toEqual({ a: { b: 2 } })
  })

  it('rejects non-object values', () => {
    expect(() => validateJsonObject('string' as JsonValue)).toThrow('Expected a JSON object')
    expect(() => validateJsonObject(123 as JsonValue)).toThrow('Expected a JSON object')
    expect(() => validateJsonObject(true as JsonValue)).toThrow('Expected a JSON object')
    expect(() => validateJsonObject([] as JsonValue)).toThrow('Expected a JSON object')
    expect(() => validateJsonObject(null as JsonValue)).toThrow('Expected a JSON object')
    expect(() => validateJsonObject(undefined as unknown as JsonValue)).toThrow('Expected a JSON object')
  })
})

describe('validateJsonBoolean', () => {
  // Basic boolean validation
  it('accepts valid JSON booleans', () => {
    expect(validateJsonBoolean(true)).toBe(true)
    expect(validateJsonBoolean(false)).toBe(false)
  })

  it('rejects non-boolean values', () => {
    expect(() => validateJsonBoolean('true' as JsonValue)).toThrow('Expected a JSON boolean')
    expect(() => validateJsonBoolean(1 as JsonValue)).toThrow('Expected a JSON boolean')
    expect(() => validateJsonBoolean({} as JsonValue)).toThrow('Expected a JSON boolean')
    expect(() => validateJsonBoolean([] as JsonValue)).toThrow('Expected a JSON boolean')
    expect(() => validateJsonBoolean(null as JsonValue)).toThrow('Expected a JSON boolean')
    expect(() => validateJsonBoolean(undefined as unknown as JsonValue)).toThrow('Expected a JSON boolean')
  })
})

describe('validateJsonNumber', () => {
  // Basic number validation
  it('accepts valid JSON numbers', () => {
    expect(validateJsonNumber(123)).toBe(123)
    expect(validateJsonNumber(0)).toBe(0)
    expect(validateJsonNumber(-1)).toBe(-1)
    expect(validateJsonNumber(1.23)).toBe(1.23)
  })

  it('rejects non-number values', () => {
    expect(() => validateJsonNumber('123' as JsonValue)).toThrow('Expected a JSON number')
    expect(() => validateJsonNumber(true as JsonValue)).toThrow('Expected a JSON number')
    expect(() => validateJsonNumber({} as JsonValue)).toThrow('Expected a JSON number')
    expect(() => validateJsonNumber([] as JsonValue)).toThrow('Expected a JSON number')
    expect(() => validateJsonNumber(null as JsonValue)).toThrow('Expected a JSON number')
    expect(() => validateJsonNumber(undefined as unknown as JsonValue)).toThrow('Expected a JSON number')
  })
})

describe('validateOptionalJsonString', () => {
  // String validation with null/undefined handling
  it('accepts valid JSON strings', () => {
    expect(validateOptionalJsonString('hello')).toBe('hello')
    expect(validateOptionalJsonString('')).toBe('')
  })

  it('accepts null and undefined', () => {
    expect(validateOptionalJsonString(null)).toBe(null)
    expect(validateOptionalJsonString(undefined as unknown as JsonValue)).toBe(null)
  })

  it('rejects invalid values', () => {
    expect(() => validateOptionalJsonString(123 as JsonValue)).toThrow('Expected a JSON string')
    expect(() => validateOptionalJsonString({} as JsonValue)).toThrow('Expected a JSON string')
  })
})

describe('validateOptionalJsonObject', () => {
  // Object validation with null/undefined handling
  it('accepts valid JSON objects', () => {
    expect(validateOptionalJsonObject({})).toEqual({})
    expect(validateOptionalJsonObject({ a: 1 })).toEqual({ a: 1 })
  })

  it('accepts null and undefined', () => {
    expect(validateOptionalJsonObject(null)).toBe(null)
    expect(validateOptionalJsonObject(undefined as unknown as JsonValue)).toBe(null)
  })

  it('rejects invalid values', () => {
    expect(() => validateOptionalJsonObject('string' as JsonValue)).toThrow('Expected a JSON object')
    expect(() => validateOptionalJsonObject([] as JsonValue)).toThrow('Expected a JSON object')
  })
})

describe('validateOptionalJsonBoolean', () => {
  // Boolean validation with null/undefined handling
  it('accepts valid JSON booleans', () => {
    expect(validateOptionalJsonBoolean(true)).toBe(true)
    expect(validateOptionalJsonBoolean(false)).toBe(false)
  })

  it('accepts null and undefined', () => {
    expect(validateOptionalJsonBoolean(null)).toBe(null)
    expect(validateOptionalJsonBoolean(undefined as unknown as JsonValue)).toBe(null)
  })

  it('rejects invalid values', () => {
    expect(() => validateOptionalJsonBoolean('true' as JsonValue)).toThrow('Expected a JSON boolean')
    expect(() => validateOptionalJsonBoolean(1 as JsonValue)).toThrow('Expected a JSON boolean')
  })
})

describe('validateOptionalJsonNumber', () => {
  // Number validation with null/undefined handling
  it('accepts valid JSON numbers', () => {
    expect(validateOptionalJsonNumber(123)).toBe(123)
    expect(validateOptionalJsonNumber(0)).toBe(0)
    expect(validateOptionalJsonNumber(-1)).toBe(-1)
  })

  it('accepts null and undefined', () => {
    expect(validateOptionalJsonNumber(null)).toBe(null)
    expect(validateOptionalJsonNumber(undefined as unknown as JsonValue)).toBe(null)
  })

  it('rejects invalid values', () => {
    expect(() => validateOptionalJsonNumber('123' as JsonValue)).toThrow('Expected a JSON number')
    expect(() => validateOptionalJsonNumber(true as JsonValue)).toThrow('Expected a JSON number')
  })
})

describe('validateJsonArray', () => {
  it('accepts valid JSON arrays', () => {
    expect(validateJsonArray([])).toEqual([])
    expect(validateJsonArray([1, 2, 3])).toEqual([1, 2, 3])
  })

  it('rejects non-array values', () => {
    expect(() => validateJsonArray('string' as JsonValue)).toThrow('Expected a JSON array')
    expect(() => validateJsonArray({} as JsonValue)).toThrow('Expected a JSON array')
  })
})


