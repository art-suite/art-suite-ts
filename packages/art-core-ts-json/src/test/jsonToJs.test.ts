import { describe, it, expect } from 'vitest'
import { jsonToJs, jsonObjectToJs, jsonArrayToJs } from '../jsonToJs'
import { JsonValue } from '../JsonTypes'

describe('jsonToJs', () => {
  it('converts strings with proper escaping', () => {
    expect(jsonToJs('hello')).toBe('"hello"')
    expect(jsonToJs('with "quotes"')).toBe('"with \\"quotes\\""')
    expect(jsonToJs('with\nnewline')).toBe('"with\\nnewline"')
  })

  it('converts scalar values', () => {
    expect(jsonToJs(123)).toBe('123')
    expect(jsonToJs(true)).toBe('true')
    expect(jsonToJs(false)).toBe('false')
    expect(jsonToJs(null)).toBe('null')
  })

  it('converts arrays with proper formatting', () => {
    expect(jsonToJs([])).toBe('[]')
    expect(jsonToJs([1, 2, 3])).toBe('[\n  1,\n  2,\n  3\n]')
    expect(jsonToJs(['a', 'b', 'c'])).toBe('[\n  "a",\n  "b",\n  "c"\n]')
  })

  it('converts objects with proper formatting', () => {
    expect(jsonToJs({})).toBe('{}')
    expect(jsonToJs({ a: 1, b: 2 })).toBe('{\n  a: 1,\n  b: 2\n}')
    expect(jsonToJs({ 'with spaces': 1 })).toBe('{\n  "with spaces": 1\n}')
  })

  it('handles nested structures', () => {
    const input = {
      a: [1, 2, { x: 'y' }],
      b: { c: [3, 4] }
    }
    expect(jsonToJs(input)).toBe(
      '{\n' +
      '  a: [\n' +
      '    1,\n' +
      '    2,\n' +
      '    {\n' +
      '      x: "y"\n' +
      '    }\n' +
      '  ],\n' +
      '  b: {\n' +
      '    c: [\n' +
      '      3,\n' +
      '      4\n' +
      '    ]\n' +
      '  }\n' +
      '}'
    )
  })

  it('converts unknown types to strings', () => {
    const unknown = { toString: () => 'custom' } as unknown as JsonValue
    expect(jsonToJs(unknown)).toBe('{\n  toString: "() => \\"custom\\""\n}')
  })
})

describe('jsonObjectToJs', () => {
  it('handles empty objects', () => {
    expect(jsonObjectToJs({})).toBe('{}')
  })

  it('formats simple objects', () => {
    expect(jsonObjectToJs({ a: 1, b: 2 })).toBe('{\n  a: 1,\n  b: 2\n}')
  })

  it('quotes invalid identifiers', () => {
    expect(jsonObjectToJs({ 'with spaces': 1 })).toBe('{\n  "with spaces": 1\n}')
    expect(jsonObjectToJs({ '123invalid': 1 })).toBe('{\n  "123invalid": 1\n}')
  })

  it('preserves valid identifiers without quotes', () => {
    expect(jsonObjectToJs({ validName: 1 })).toBe('{\n  validName: 1\n}')
    expect(jsonObjectToJs({ camelCase: 1 })).toBe('{\n  camelCase: 1\n}')
  })

  it('handles nested objects', () => {
    const input = {
      a: { b: { c: 1 } }
    }
    expect(jsonObjectToJs(input)).toBe(
      '{\n' +
      '  a: {\n' +
      '    b: {\n' +
      '      c: 1\n' +
      '    }\n' +
      '  }\n' +
      '}'
    )
  })
})

describe('jsonArrayToJs', () => {
  it('handles empty arrays', () => {
    expect(jsonArrayToJs([])).toBe('[]')
  })

  it('formats simple arrays', () => {
    expect(jsonArrayToJs([1, 2, 3])).toBe('[\n  1,\n  2,\n  3\n]')
  })

  it('handles arrays of different types', () => {
    expect(jsonArrayToJs(['a', 1, true, null])).toBe('[\n  "a",\n  1,\n  true,\n  null\n]')
  })

  it('handles nested arrays', () => {
    expect(jsonArrayToJs([1, [2, 3], 4])).toBe(
      '[\n' +
      '  1,\n' +
      '  [\n' +
      '    2,\n' +
      '    3\n' +
      '  ],\n' +
      '  4\n' +
      ']'
    )
  })

  it('handles arrays with objects', () => {
    expect(jsonArrayToJs([{ a: 1 }, { b: 2 }])).toBe(
      '[\n' +
      '  {\n' +
      '    a: 1\n' +
      '  },\n' +
      '  {\n' +
      '    b: 2\n' +
      '  }\n' +
      ']'
    )
  })
})