import { describe, it, expect } from 'vitest'
import { isJsonObject, isJsonArray, isJsonPrimitive, isJsonString, isJsonNumber, isJsonBoolean, isJsonValue, isJsonValueDeep } from '../JsonTypeFunctions'
import { JsonValue } from '../JsonTypes'

describe('isJsonObject', () => {
  it('returns true for plain objects', () => {
    expect(isJsonObject({})).toBe(true)
    expect(isJsonObject({ a: 1 })).toBe(true)
    expect(isJsonObject({ a: { b: 2 } })).toBe(true)
  })

  it('returns false for non-objects', () => {
    expect(isJsonObject(null)).toBe(false)
    expect(isJsonObject(undefined)).toBe(false)
    expect(isJsonObject([])).toBe(false)
    expect(isJsonObject('string')).toBe(false)
    expect(isJsonObject(123)).toBe(false)
    expect(isJsonObject(true)).toBe(false)
  })
})

describe('isJsonArray', () => {
  it('returns true for arrays', () => {
    expect(isJsonArray([])).toBe(true)
    expect(isJsonArray([1, 2, 3])).toBe(true)
    expect(isJsonArray(['a', 'b'])).toBe(true)
    expect(isJsonArray([{ a: 1 }, { b: 2 }])).toBe(true)
  })

  it('returns false for non-arrays', () => {
    expect(isJsonArray(null)).toBe(false)
    expect(isJsonArray(undefined)).toBe(false)
    expect(isJsonArray({})).toBe(false)
    expect(isJsonArray('string')).toBe(false)
    expect(isJsonArray(123)).toBe(false)
    expect(isJsonArray(true)).toBe(false)
  })
})

describe('isJsonPrimitive', () => {
  it('returns true for scalar values', () => {
    expect(isJsonPrimitive('string')).toBe(true)
    expect(isJsonPrimitive(123)).toBe(true)
    expect(isJsonPrimitive(true)).toBe(true)
    expect(isJsonPrimitive(null)).toBe(true)
  })

  it('returns false for non-scalar values', () => {
    expect(isJsonPrimitive({})).toBe(false)
    expect(isJsonPrimitive([])).toBe(false)
    expect(isJsonPrimitive(undefined)).toBe(false)
  })
})

describe('isJsonString', () => {
  it('returns true for strings', () => {
    expect(isJsonString('')).toBe(true)
    expect(isJsonString('hello')).toBe(true)
    expect(isJsonString('123')).toBe(true)
  })

  it('returns false for non-strings', () => {
    expect(isJsonString(null)).toBe(false)
    expect(isJsonString(undefined)).toBe(false)
    expect(isJsonString({})).toBe(false)
    expect(isJsonString([])).toBe(false)
    expect(isJsonString(123)).toBe(false)
    expect(isJsonString(true)).toBe(false)
  })
})

describe('isJsonNumber', () => {
  it('returns true for numbers', () => {
    expect(isJsonNumber(0)).toBe(true)
    expect(isJsonNumber(123)).toBe(true)
    expect(isJsonNumber(-1)).toBe(true)
    expect(isJsonNumber(1.23)).toBe(true)
  })

  it('returns false for non-numbers', () => {
    expect(isJsonNumber(null)).toBe(false)
    expect(isJsonNumber(undefined)).toBe(false)
    expect(isJsonNumber({})).toBe(false)
    expect(isJsonNumber([])).toBe(false)
    expect(isJsonNumber('123')).toBe(false)
    expect(isJsonNumber(true)).toBe(false)
  })
})

describe('isJsonBoolean', () => {
  it('returns true for booleans', () => {
    expect(isJsonBoolean(true)).toBe(true)
    expect(isJsonBoolean(false)).toBe(true)
  })

  it('returns false for non-booleans', () => {
    expect(isJsonBoolean(null)).toBe(false)
    expect(isJsonBoolean(undefined)).toBe(false)
    expect(isJsonBoolean({})).toBe(false)
    expect(isJsonBoolean([])).toBe(false)
    expect(isJsonBoolean('true')).toBe(false)
    expect(isJsonBoolean(1)).toBe(false)
  })
})

describe('isJsonValue', () => {
  it('returns true for primitive values', () => {
    expect(isJsonValue('string')).toBe(true)
    expect(isJsonValue(123)).toBe(true)
    expect(isJsonValue(true)).toBe(true)
    expect(isJsonValue(null)).toBe(true)
  })

  it('returns true for objects and arrays', () => {
    expect(isJsonValue({})).toBe(true)
    expect(isJsonValue([])).toBe(true)
    expect(isJsonValue({ a: 1 })).toBe(true)
    expect(isJsonValue([1, 2, 3])).toBe(true)
  })

  it('returns false for non-JSON values', () => {
    expect(isJsonValue(undefined)).toBe(false)
    expect(isJsonValue(() => { })).toBe(false)
    expect(isJsonValue(Symbol())).toBe(false)
  })
})

describe('isJsonValueDeep', () => {
  it('returns true for primitive values', () => {
    expect(isJsonValueDeep('string')).toBe(true)
    expect(isJsonValueDeep(123)).toBe(true)
    expect(isJsonValueDeep(true)).toBe(true)
    expect(isJsonValueDeep(null)).toBe(true)
  })

  it('returns true for nested valid JSON structures', () => {
    expect(isJsonValueDeep({ a: 1, b: "string", c: null })).toBe(true)
    expect(isJsonValueDeep([1, "string", null])).toBe(true)
    expect(isJsonValueDeep({ a: { b: [1, 2, { c: "string" }] } })).toBe(true)
  })

  it('returns false for structures containing non-JSON values', () => {
    expect(isJsonValueDeep({ a: undefined })).toBe(false)
    expect(isJsonValueDeep([1, () => { }])).toBe(false)
    expect(isJsonValueDeep({ a: { b: Symbol() } })).toBe(false)
  })
})