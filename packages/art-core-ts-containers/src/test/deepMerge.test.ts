import { describe, it, expect } from 'vitest'
import { deepMerge, deepMergeInfo } from '../deepMerge'

describe('deepMerge', () => {
  it('merges multiple objects in order with later params having priority', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { b: 3, c: 4 }
    const obj3 = { d: 5 }
    expect(deepMerge(obj1, obj2, obj3)).toEqual({ a: 1, b: 3, c: 4, d: 5 })
  })

  it('handles undefined fields by skipping them', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { b: undefined, c: 4 }
    const obj3 = { d: undefined }
    const result = deepMerge(obj1, obj2, obj3)
    expect(result).toEqual({ a: 1, b: 2, c: 4 })
  })

  it('preserves null fields and allows them to override values', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { b: null, c: 4 }
    const obj3 = { d: null }
    const result = deepMerge(obj1, obj2, obj3)
    expect(result).toEqual({ a: 1, b: null, c: 4, d: null })
  })

  it('handles null and undefined inputs by treating them as empty objects', () => {
    const obj1 = { a: 1 }
    const result = deepMerge(obj1, null, undefined)
    expect(result).toEqual({ a: 1 })
  })

  it('handles mixed null/undefined fields with correct precedence', () => {
    const obj1 = { a: 1, b: 2, c: 3 }
    const obj2 = { a: undefined, b: null, d: 4 }
    const obj3 = { a: 5, b: undefined, e: null }
    const result = deepMerge(obj1, obj2, obj3)
    expect(result).toEqual({ a: 5, b: null, c: 3, d: 4, e: null })
  })

  it('handles empty objects', () => {
    expect(deepMerge({}, {})).toEqual({})
  })

  it('deep merges nested objects', () => {
    const obj1 = {
      user: {
        name: 'John',
        settings: { theme: 'dark', notifications: true }
      }
    }
    const obj2 = {
      user: {
        age: 30,
        settings: { theme: 'light', language: 'en' }
      }
    }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({
      user: {
        name: 'John',
        age: 30,
        settings: { theme: 'light', notifications: true, language: 'en' }
      }
    })
  })

  it('deep merges nested arrays', () => {
    const obj1 = {
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ]
    }
    const obj2 = {
      items: [
        { id: 1, name: 'Updated Item 1', price: 10 },
        { id: 3, name: 'Item 3' }
      ]
    }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({
      items: [
        { id: 1, name: 'Updated Item 1', price: 10 },
        { id: 3, name: 'Item 3' }
      ]
    })
  })

  it('handles arrays of primitives', () => {
    const obj1 = { tags: ['javascript', 'typescript'] }
    const obj2 = { tags: ['react', 'vue'] }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({ tags: ['react', 'vue'] })
  })

  it('handles mixed array and object structures', () => {
    const obj1 = {
      config: {
        plugins: ['plugin1', 'plugin2'],
        settings: { debug: true }
      }
    }
    const obj2 = {
      config: {
        plugins: ['plugin3'],
        settings: { debug: false, verbose: true }
      }
    }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({
      config: {
        plugins: ['plugin3'],
        settings: { debug: false, verbose: true }
      }
    })
  })

  it('handles deeply nested structures', () => {
    const obj1 = {
      level1: {
        level2: {
          level3: {
            value: 'original',
            nested: { deep: 'value' }
          }
        }
      }
    }
    const obj2 = {
      level1: {
        level2: {
          level3: {
            value: 'updated',
            nested: { deep: 'new-value', extra: 'field' }
          }
        }
      }
    }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({
      level1: {
        level2: {
          level3: {
            value: 'updated',
            nested: { deep: 'new-value', extra: 'field' }
          }
        }
      }
    })
  })

  it('handles null as erase mechanism in nested structures', () => {
    const obj1 = {
      user: {
        name: 'John',
        settings: { theme: 'dark', notifications: true }
      }
    }
    const obj2 = {
      user: {
        settings: null
      }
    }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({
      user: {
        name: 'John',
        settings: null
      }
    })
  })

  it('handles undefined in nested structures by skipping', () => {
    const obj1 = {
      user: {
        name: 'John',
        settings: { theme: 'dark', notifications: true }
      }
    }
    const obj2 = {
      user: {
        settings: undefined
      }
    }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({
      user: {
        name: 'John',
        settings: { theme: 'dark', notifications: true }
      }
    })
  })

  it('handles non-plain objects by returning the later value', () => {
    const date1 = new Date('2023-01-01')
    const date2 = new Date('2023-02-01')
    const obj1 = { timestamp: date1 }
    const obj2 = { timestamp: date2 }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({ timestamp: date2 })
  })

  it('handles mixed types in arrays', () => {
    const obj1 = {
      data: [
        { id: 1, value: 'original' },
        'string value',
        42
      ]
    }
    const obj2 = {
      data: [
        { id: 1, value: 'updated', extra: 'field' },
        'new string',
        100
      ]
    }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({
      data: [
        { id: 1, value: 'updated', extra: 'field' },
        'new string',
        100
      ]
    })
  })

  it('handles empty arrays', () => {
    const obj1 = { items: [1, 2, 3] }
    const obj2 = { items: [] }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({ items: [] })
  })

  it('handles undefined arrays', () => {
    const obj1 = { items: [1, 2, 3] }
    const obj2 = { items: undefined }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({ items: [1, 2, 3] })
  })

  it('handles null arrays', () => {
    const obj1 = { items: [1, 2, 3] }
    const obj2 = { items: null }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({ items: null })
  })
})

describe('deepMergeInfo', () => {
  it('merges into target object preserving order', () => {
    const target = { a: 1 }
    const source = { b: 2 }
    const result = deepMergeInfo(target, source)
    expect(result).toEqual({ a: 1, b: 2 })
    expect(target).toEqual({ a: 1, b: 2 })
  })

  it('handles undefined fields by skipping them', () => {
    const target = { a: 1, b: 2 }
    const source = { b: undefined, c: 4 }
    const result = deepMergeInfo(target, source)
    expect(result).toEqual({ a: 1, b: 2, c: 4 })
    expect(target).toEqual({ a: 1, b: 2, c: 4 })
  })

  it('preserves null fields and allows them to override values', () => {
    const target = { a: 1, b: 2 }
    const source = { b: null, c: 4 }
    const result = deepMergeInfo(target, source)
    expect(result).toEqual({ a: 1, b: null, c: 4 })
    expect(target).toEqual({ a: 1, b: null, c: 4 })
  })

  it('handles null and undefined inputs by treating them as empty objects', () => {
    const target = { a: 1 }
    const result = deepMergeInfo(target, null, undefined)
    expect(result).toEqual({ a: 1 })
    expect(target).toEqual({ a: 1 })
  })

  it('handles mixed null/undefined fields with correct precedence', () => {
    const target = { a: 1, b: 2, c: 3 }
    const source1 = { a: undefined, b: null, d: 4 }
    const source2 = { a: 5, b: undefined, e: null }
    const result = deepMergeInfo(target, source1, source2)
    expect(result).toEqual({ a: 5, b: null, c: 3, d: 4, e: null })
    expect(target).toEqual({ a: 5, b: null, c: 3, d: 4, e: null })
  })

  it('handles empty objects', () => {
    const target = {}
    const result = deepMergeInfo(target, {})
    expect(result).toEqual({})
    expect(target).toEqual({})
  })

  it('deep merges nested objects into target', () => {
    const target = {
      user: {
        name: 'John',
        settings: { theme: 'dark', notifications: true }
      }
    }
    const source = {
      user: {
        age: 30,
        settings: { theme: 'light', language: 'en' }
      }
    }
    const result = deepMergeInfo(target, source)
    expect(result).toEqual({
      user: {
        name: 'John',
        age: 30,
        settings: { theme: 'light', notifications: true, language: 'en' }
      }
    })
    expect(target).toEqual({
      user: {
        name: 'John',
        age: 30,
        settings: { theme: 'light', notifications: true, language: 'en' }
      }
    })
  })

  it('handles multiple sources in order', () => {
    const target = { a: 1, b: 2 }
    const source1 = { b: 3, c: 4 }
    const source2 = { c: 5, d: 6 }
    const result = deepMergeInfo(target, source1, source2)
    expect(result).toEqual({ a: 1, b: 3, c: 5, d: 6 })
    expect(target).toEqual({ a: 1, b: 3, c: 5, d: 6 })
  })
})