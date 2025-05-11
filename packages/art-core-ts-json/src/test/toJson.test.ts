import { describe, it, expect } from 'vitest'
import { toJsonValue, toJsonObject, toJsonObjectOrNull, toJsonPropsObject } from '../toJsonValue'
import { JsonValue } from '../JsonTypes'
import type { ToJsonValue } from '../JsonTypes'

describe('toJsonValue', () => {
  it('converts Date to ISO string', () => {
    const date = new Date('2024-01-01T12:00:00Z')
    expect(toJsonValue(date)).toBe('2024-01-01T12:00:00.000Z')
  })

  it('preserves JSON primitive values', () => {
    expect(toJsonValue('string')).toBe('string')
    expect(toJsonValue(123)).toBe(123)
    expect(toJsonValue(true)).toBe(true)
    expect(toJsonValue(null)).toBe(null)
  })

  it('converts objects recursively', () => {
    const input = {
      date: new Date('2024-01-01T12:00:00Z'),
      nested: {
        date: new Date('2024-01-01T12:00:00Z')
      }
    }
    expect(toJsonValue(input)).toEqual({
      date: '2024-01-01T12:00:00.000Z',
      nested: {
        date: '2024-01-01T12:00:00.000Z'
      }
    })
  })

  it('converts arrays recursively', () => {
    const input = [
      new Date('2024-01-01T12:00:00Z'),
      {
        date: new Date('2024-01-01T12:00:00Z')
      }
    ]
    expect(toJsonValue(input)).toEqual([
      '2024-01-01T12:00:00.000Z',
      {
        date: '2024-01-01T12:00:00.000Z'
      }
    ])
  })

  it('converts unknown types to string', () => {
    expect(toJsonValue(() => 123)).toBe('() => 123')
  })

  it('handles null and undefined', () => {
    expect(toJsonValue(null)).toBe(null)
    expect(toJsonValue(undefined)).toBe(null)
  })

  it('uses toJsonValue method if present on object', () => {
    const obj: ToJsonValue = {
      toJsonValue: () => ({ b: 2, c: 'str' })
    }
    expect(toJsonValue(obj)).toEqual({ b: 2, c: 'str' })
  })

  it('uses toJsonValue method if present on custom object', () => {
    class Custom implements ToJsonValue {
      toJsonValue() { return { b: 2, c: 'str' } }
    }
    expect(toJsonValue(new Custom())).toEqual({ b: 2, c: 'str' })
  })

  it('recursively processes the result of toJsonValue', () => {
    class Custom implements ToJsonValue {
      toJsonValue() { return { d: new Date('2024-01-01T12:00:00Z').toISOString() } }
    }
    const result = toJsonValue(new Custom())
    expect(result).toEqual({ d: '2024-01-01T12:00:00.000Z' })
  })

  it('returns toJsonValue result as-is without recursive processing', () => {
    class Custom implements ToJsonValue {
      toJsonValue() { return (() => 123) as unknown as JsonValue }
    }
    const result = toJsonValue(new Custom()) as unknown as () => number
    expect(typeof result).toBe('function')
    expect(result()).toBe(123)
  })
})

describe('toJsonObject', () => {
  it('converts plain objects recursively', () => {
    const input = {
      date: new Date('2024-01-01T12:00:00Z'),
      nested: {
        date: new Date('2024-01-01T12:00:00Z')
      }
    }
    expect(toJsonObject(input)).toEqual({
      date: '2024-01-01T12:00:00.000Z',
      nested: {
        date: '2024-01-01T12:00:00.000Z'
      }
    })
  })

  it('returns empty object for non-objects', () => {
    expect(toJsonObject(null)).toEqual({})
    expect(toJsonObject(undefined)).toEqual({})
    expect(toJsonObject([])).toEqual({})
    expect(toJsonObject('string')).toEqual({})
    expect(toJsonObject(123)).toEqual({})
    expect(toJsonObject(true)).toEqual({})
  })

  it('preserves object structure', () => {
    const input = {
      a: 1,
      b: 'string',
      c: true,
      d: null,
      e: undefined
    }
    expect(toJsonObject(input)).toEqual({
      a: 1,
      b: 'string',
      c: true,
      d: null,
      e: null
    })
  })
})

describe('toJsonObjectOrNull', () => {
  it('converts objects recursively', () => {
    const input = {
      date: new Date('2024-01-01T12:00:00Z'),
      nested: {
        date: new Date('2024-01-01T12:00:00Z')
      }
    }
    expect(toJsonObjectOrNull(input)).toEqual({
      date: '2024-01-01T12:00:00.000Z',
      nested: {
        date: '2024-01-01T12:00:00.000Z'
      }
    })
  })

  it('returns null for null/undefined', () => {
    expect(toJsonObjectOrNull(null)).toBe(null)
    expect(toJsonObjectOrNull(undefined)).toBe(null)
  })

  it('returns empty object for non-objects', () => {
    expect(toJsonObjectOrNull([])).toEqual({})
    expect(toJsonObjectOrNull('string')).toEqual({})
    expect(toJsonObjectOrNull(123)).toEqual({})
    expect(toJsonObjectOrNull(true)).toEqual({})
  })
})

describe('toJsonPropsObject', () => {
  it('filters out non-scalar values', () => {
    const input = {
      a: 1,
      b: 'string',
      c: true,
      d: null,
      e: undefined,
      f: { nested: 1 },
      g: [1, 2, 3],
      h: new Date()
    }
    expect(toJsonPropsObject(input)).toEqual({
      a: 1,
      b: 'string',
      c: true,
      d: null
    })
  })

  it('returns empty object for non-objects', () => {
    expect(toJsonPropsObject(null)).toEqual({})
    expect(toJsonPropsObject(undefined)).toEqual({})
    expect(toJsonPropsObject([])).toEqual({})
    expect(toJsonPropsObject('string')).toEqual({})
    expect(toJsonPropsObject(123)).toEqual({})
    expect(toJsonPropsObject(true)).toEqual({})
  })

  it('preserves scalar values', () => {
    const input = {
      number: 123,
      string: 'test',
      boolean: true,
      null: null
    }
    expect(toJsonPropsObject(input)).toEqual({
      number: 123,
      string: 'test',
      boolean: true,
      null: null
    })
  })
})