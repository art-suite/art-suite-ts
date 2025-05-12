import { describe, it, expect } from 'vitest'
import { compact, flatten, compactFlatten, NestedArray } from '../CompactFlatten'

describe('compact', () => {
  it('removes null and undefined values', () => {
    expect(compact([1, null, undefined, 2])).toEqual([1, 2])
  })

  it('returns original array if no null/undefined values', () => {
    const arr = [1, 2, 3]
    expect(compact(arr)).toBe(arr)
  })

  it('handles null input', () => {
    expect(compact(null)).toEqual([])
  })

  it('handles undefined input', () => {
    expect(compact(undefined)).toEqual([])
  })
})

describe('flatten', () => {
  it('flattens the type correctly', () => {
    const foo: NestedArray<string> = [[[[[[["hi"]]]]]]]
    const bar = flatten(foo)
    expect(bar).toEqual(["hi"])
  })

  it('flattens nested arrays', () => {
    expect(flatten([1, 2, 3, [4, 5]])).toEqual([1, 2, 3, 4, 5])
  })

  it('returns original array if already flat', () => {
    const arr = [1, 2, 3]
    expect(flatten(arr)).toBe(arr)
  })

  it('handles deeply nested arrays', () => {
    expect(flatten([1, [2, [3, [4, 5]]]])).toEqual([1, 2, 3, 4, 5])
  })

  it('handles null input', () => {
    expect(flatten(null)).toEqual([])
  })

  it('handles undefined input', () => {
    expect(flatten(undefined)).toEqual([])
  })
})

describe('compactFlatten', () => {
  it('compactFlattens the type correctly', () => {
    const foo: NestedArray<string | null | undefined> = [[[[[[["hi", null, undefined]]]]]]]
    const bar = compactFlatten(foo)
    expect(bar).toEqual(["hi"])
  })

  it('compacts and flattens arrays', () => {
    const structure = [0, [false], 1, 2, null, 3, [4, undefined, 5]]
    expect(compactFlatten(structure)).toEqual([0, false, 1, 2, 3, 4, 5])
  })

  it('returns same result as compact(flatten())', () => {
    const structure = [0, [false], 1, 2, null, 3, [4, undefined, 5]]
    const cF = compactFlatten(structure)
    const c_f = compact(flatten(structure))
    expect(cF).toEqual(c_f)
  })

  it('handles null input', () => {
    expect(compactFlatten(null)).toEqual([])
  })

  it('handles undefined input', () => {
    expect(compactFlatten(undefined)).toEqual([])
  })

  it('handles non-array inputs', () => {
    expect(compactFlatten(false as any)).toEqual([false])
    expect(compactFlatten(1 as any)).toEqual([1])
    expect(compactFlatten('' as any)).toEqual([''])
    expect(compactFlatten({} as any)).toEqual([{}])
    expect(compactFlatten([])).toEqual([])
    expect(compactFlatten('a' as any)).toEqual(['a'])
  })
})

// test "compactFlatten with only compacting needed", ->
//   assert.eq (compactFlatten [1, null, undefined]), [1]

// test "compactFlatten with only flattening needed", ->
//   assert.eq (compactFlatten [1,2,3,[4,5]]), [1,2,3,4,5]

// test "compactFlatten(a) and compact(flatten(a)) return same structure", ->
//   structure = [0, [false], 1, 2, null, 3, [4, undefined, 5]]
//   cF = compactFlatten structure
//   c_f = compact flatten structure
//   assert.eq cF, c_f

// test "customCompactFlatten", ->
//   structure = [0, [false], 1, 2, null, 3, [4, undefined, 5]]
//   assert.eq (compactFlatten structure), [0, false, 1, 2, 3, 4, 5]
//   assert.eq (customCompactFlatten structure, (a) -> !!a), [1, 2, 3, 4, 5]

// test "compactFlatten null", -> assert.eq null, compactFlatten null
// test "compactFlatten undefined", -> assert.eq undefined, compactFlatten undefined
// test "compactFlatten false", -> assert.eq [false], compactFlatten false
// test "compactFlatten 1", -> assert.eq [1], compactFlatten 1
// test "compactFlatten ''", -> assert.eq [""], compactFlatten ""
// test "compactFlatten {}", -> assert.eq [{}], compactFlatten {}
// test "compactFlatten []", -> assert.eq [], compactFlatten []
// test "compactFlatten 'a'", -> assert.eq ["a"], compactFlatten "a"
