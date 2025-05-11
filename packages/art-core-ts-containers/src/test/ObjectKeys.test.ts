import { describe, it, expect } from 'vitest'
import { objectHasKeys, objectKeyCount } from '../ObjectKeys'

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