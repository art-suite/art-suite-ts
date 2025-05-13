import { describe, it, expect } from 'vitest'
import { objectHasKeys, objectKeyCount, objectWithout } from '../ObjectLib'

describe('objectHasKey', () => {
  it('returns true for object with own properties', () => {
    expect(objectHasKeys({ a: 1 })).toBe(true)
    expect(objectHasKeys({ a: 1, b: 2 })).toBe(true)
  })

  it('returns false for empty object', () => {
    expect(objectHasKeys({})).toBe(false)
  })

  it('returns false for object with only inherited properties', () => {
    const obj = Object.create({ inherited: 1 })
    expect(objectHasKeys(obj)).toBe(false)
  })
})

describe('objectKeyCount', () => {
  it('returns correct count for objects with own properties', () => {
    expect(objectKeyCount({})).toBe(0)
    expect(objectKeyCount({ a: 1 })).toBe(1)
    expect(objectKeyCount({ a: 1, b: 2 })).toBe(2)
    expect(objectKeyCount({ a: 1, b: 2, c: 3 })).toBe(3)
  })

  it('ignores inherited properties', () => {
    const obj = Object.create({ inherited: 1 })
    expect(objectKeyCount(obj)).toBe(0)

    obj.own = 2
    expect(objectKeyCount(obj)).toBe(1)
  })
})

describe('objectWithout', () => {
  it('returns empty object when input is null/undefined', () => {
    expect(objectWithout(null, 'a')).toEqual({})
    expect(objectWithout(undefined, 'a')).toEqual({})
  })

  it('returns same object when no properties to remove exist', () => {
    const obj = { a: 1, b: 2 }
    expect(objectWithout(obj)).toBe(obj)
    expect(objectWithout(obj, 'a')).toEqual({ b: 2 })
  })

  it('removes specified properties', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(objectWithout(obj, 'a')).toEqual({ b: 2, c: 3 })
    expect(objectWithout(obj, 'a', 'c')).toEqual({ b: 2 })
  })

  it('handles nested arrays in properties argument', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(objectWithout(obj, 'a', 'b')).toEqual({ c: 3 })
  })

  it('preserves object type information', () => {
    type TestType = { a: number; b: string; c: boolean }
    const obj: TestType = { a: 1, b: '2', c: true }
    const result = objectWithout(obj, 'a')
    // TypeScript should know result has b and c but not a
    expect(result).toEqual({ b: '2', c: true })
  })
})