import { describe, it, expect } from 'vitest'
import { asJsonObject, asJsonPropsObject } from '../asJson'
import { JsonValue } from '../JsonTypes'

describe('asJsonObject', () => {
  it('returns the input object if it is a valid JSON object', () => {
    const obj = { a: 1, b: 'string', c: true }
    expect(asJsonObject(obj)).toBe(obj) // should return the same object reference
    expect(asJsonObject({})).toEqual({})
    expect(asJsonObject({ a: { b: 2 } })).toEqual({ a: { b: 2 } })
  })

  it('returns an empty object for non-object values', () => {
    expect(asJsonObject(null as JsonValue)).toEqual({})
    expect(asJsonObject(undefined as unknown as JsonValue)).toEqual({})
    expect(asJsonObject([] as JsonValue)).toEqual({})
    expect(asJsonObject('string' as JsonValue)).toEqual({})
    expect(asJsonObject(123 as JsonValue)).toEqual({})
    expect(asJsonObject(true as JsonValue)).toEqual({})
  })

  it('preserves object identity for valid objects', () => {
    const obj = { a: 1 }
    expect(asJsonObject(obj)).toBe(obj) // should be the same object reference
  })

  it('creates new empty objects for invalid inputs', () => {
    const result1 = asJsonObject(null as JsonValue)
    const result2 = asJsonObject(null as JsonValue)
    expect(result1).toEqual({})
    expect(result2).toEqual({})
    expect(result1).not.toBe(result2) // should be different object references
  })
})

describe('asJsonPropsObject', () => {
  it('returns the input object if it is a valid JSON object', () => {
    const obj = { a: 1, b: 'string', c: true }
    expect(asJsonPropsObject(obj)).toEqual({ a: 1, b: 'string', c: true })
    expect(asJsonPropsObject({})).toEqual({})
  })

  it('drops object props', () => {
    expect(asJsonPropsObject({ a: { b: 2 }, c: 3 })).toEqual({ c: 3 })
  })

  // drops arrays
  it('drops array props', () => {
    expect(asJsonPropsObject({ a: [1, 2, 3], b: 4 })).toEqual({ b: 4 })
  })

  // converts root array to empty object
  it('converts root array to empty object', () => {
    expect(asJsonPropsObject([1, 2, 3])).toEqual({})
  })
})