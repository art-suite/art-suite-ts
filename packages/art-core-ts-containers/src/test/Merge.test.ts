import { describe, it, expect } from 'vitest'
import { merge, mergeInto } from '../Merge'

describe('merge', () => {
  it('merges multiple objects in order', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { b: 3, c: 4 }
    const obj3 = { d: 5 }
    expect(merge(obj1, obj2, obj3)).toEqual({ a: 1, b: 3, c: 4, d: 5 })
  })

  it('handles undefined fields by skipping them', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { b: undefined, c: 4 }
    const obj3 = { d: undefined }
    const result = merge(obj1, obj2, obj3)
    expect(result).toEqual({ a: 1, b: 2, c: 4 })
    // Verify type correctness
    const typed: { a: number; b: number; c: number } = result
  })

  it('preserves null fields and allows them to override values', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { b: null, c: 4 }
    const obj3 = { d: null }
    const result = merge(obj1, obj2, obj3)
    expect(result).toEqual({ a: 1, b: null, c: 4, d: null })
    // Verify type correctness
    const typed: { a: number; b: null; c: number; d: null } = result
  })

  it('handles null and undefined inputs by treating them as empty objects', () => {
    const obj1 = { a: 1 }
    const result = merge(obj1, null, undefined)
    expect(result).toEqual({ a: 1 })
    // Verify type correctness
    const typed: { a: number } = result
  })

  it('handles mixed null/undefined fields with correct precedence', () => {
    const obj1 = { a: 1, b: 2, c: 3 }
    const obj2 = { a: undefined, b: null, d: 4 }
    const obj3 = { a: 5, b: undefined, e: null }
    const result = merge(obj1, obj2, obj3)
    expect(result).toEqual({ a: 5, b: null, c: 3, d: 4, e: null })
    // Verify type correctness
    const typed: { a: number; b: null; c: number; d: number; e: null } = result
  })

  it('handles empty objects', () => {
    expect(merge({}, {})).toEqual({})
  })
})

describe('mergeInto', () => {
  it('merges into target object preserving order', () => {
    const target = { a: 1 }
    const source = { b: 2 }
    expect(mergeInto(target, source)).toEqual({ a: 1, b: 2 })
    expect(target).toEqual({ a: 1, b: 2 })
  })

  it('handles undefined fields by skipping them', () => {
    const target = { a: 1, b: 2 }
    const source = { b: undefined, c: 4 }
    const result = mergeInto(target, source)
    expect(result).toEqual({ a: 1, b: 2, c: 4 })
    expect(target).toEqual({ a: 1, b: 2, c: 4 })
    // Verify type correctness
    const typed: { a: number; b: number; c: number } = result
  })

  it('preserves null fields and allows them to override values', () => {
    const target = { a: 1, b: 2 }
    const source = { b: null, c: 4 }
    const result = mergeInto(target, source)
    expect(result).toEqual({ a: 1, b: null, c: 4 })
    expect(target).toEqual({ a: 1, b: null, c: 4 })
    // Verify type correctness
    const typed: { a: number; b: null; c: number } = result
  })

  it('handles null and undefined inputs by treating them as empty objects', () => {
    const target = { a: 1 }
    const result = mergeInto(target, null, undefined)
    expect(result).toEqual({ a: 1 })
    expect(target).toEqual({ a: 1 })
    // Verify type correctness
    const typed: { a: number } = result
  })

  it('handles mixed null/undefined fields with correct precedence', () => {
    const target = { a: 1, b: 2, c: 3 }
    const source1 = { a: undefined, b: null, d: 4 }
    const source2 = { a: 5, b: undefined, e: null }
    const result = mergeInto(target, source1, source2)
    expect(result).toEqual({ a: 5, b: null, c: 3, d: 4, e: null })
    expect(target).toEqual({ a: 5, b: null, c: 3, d: 4, e: null })
    // Verify type correctness
    const typed: { a: number; b: null; c: number; d: number; e: null } = result
  })

  it('handles empty objects', () => {
    const target = {}
    expect(mergeInto(target, {})).toEqual({})
    expect(target).toEqual({})
  })

})