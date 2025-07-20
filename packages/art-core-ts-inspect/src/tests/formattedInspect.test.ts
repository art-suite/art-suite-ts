import { test, expect } from 'vitest'
import { formattedInspect } from '../'
import { noColors } from '../colors'
import stripAnsi from 'strip-ansi'

test('formattedInspect handles null and undefined', () => {
  expect(formattedInspect(null, { colors: noColors })).toBe('null')
  expect(formattedInspect(undefined, { colors: noColors })).toBe('undefined')
  expect(formattedInspect(undefined, { colors: noColors, json: true })).toBe('null')
})

test('formattedInspect handles primitive types', () => {
  expect(formattedInspect('hello', { colors: noColors })).toBe('hello')
  expect(formattedInspect('hello world', { colors: noColors, unquoted: false })).toBe('hello world')
  expect(formattedInspect('hello world', { colors: noColors, unquoted: false }, 1)).toContain('hello world')
  expect(formattedInspect(42, { colors: noColors })).toBe('42')
  expect(formattedInspect(true, { colors: noColors })).toBe('true')
  expect(formattedInspect(false, { colors: noColors })).toBe('false')
})

test('formattedInspect handles dates', () => {
  const date = new Date('2023-01-01T12:00:00.000Z')
  expect(formattedInspect(date, { colors: noColors })).toBe('2023-01-01T12:00:00.000Z')
  expect(formattedInspect(date, { colors: noColors, unquoted: true })).toContain('2023')
  expect(formattedInspect(date, { colors: noColors, json: true })).toContain('2023-01-01T12:00:00.000Z')
})

test('formattedInspect handles empty arrays', () => {
  expect(formattedInspect([], { colors: noColors })).toBe('[]')
})

test('formattedInspect handles arrays with primitive values', () => {
  const result1 = formattedInspect([1, 2, 3], { colors: noColors })
  expect(result1).toContain('1')
  expect(result1).toContain('2')
  expect(result1).toContain('3')

  const result2 = formattedInspect(['a', 'b', 'c'], { colors: noColors })
  expect(result2).toContain('a')
  expect(result2).toContain('b')
  expect(result2).toContain('c')

  const result3 = formattedInspect([true, false], { colors: noColors })
  expect(result3).toContain('true')
  expect(result3).toContain('false')
})

test('formattedInspect handles nested arrays', () => {
  const result = formattedInspect([[1, 2], [3, 4]], { colors: noColors })
  expect(result).toContain('1')
  expect(result).toContain('2')
  expect(result).toContain('3')
  expect(result).toContain('4')
})

test('formattedInspect handles empty objects', () => {
  expect(formattedInspect({}, { colors: noColors })).toBe('{}')
})

test('formattedInspect handles objects with primitive values', () => {
  const result1 = formattedInspect({ a: 1, b: 2 }, { colors: noColors })
  expect(result1).toContain('a')
  expect(result1).toContain('b')
  expect(result1).toContain('1')
  expect(result1).toContain('2')

  const result2 = formattedInspect({ name: 'john', age: 30 }, { colors: noColors })
  expect(result2).toContain('name')
  expect(result2).toContain('john')
  expect(result2).toContain('age')
  expect(result2).toContain('30')
})

test('formattedInspect handles nested objects', () => {
  const obj = {
    user: {
      name: 'john',
      details: {
        age: 30,
        city: 'nyc'
      }
    }
  }
  const result = formattedInspect(obj, { colors: noColors })
  expect(result).toContain('user')
  expect(result).toContain('name')
  expect(result).toContain('john')
  expect(result).toContain('details')
  expect(result).toContain('age')
  expect(result).toContain('30')
  expect(result).toContain('city')
  expect(result).toContain('nyc')
})

test('formattedInspect handles objects with array values', () => {
  const obj = {
    tags: ['javascript', 'typescript'],
    scores: [85, 92, 78]
  }
  const result = formattedInspect(obj, { colors: noColors })
  expect(result).toContain('tags')
  expect(result).toContain('javascript')
  expect(result).toContain('typescript')
  expect(result).toContain('scores')
  expect(result).toContain('85')
  expect(result).toContain('92')
  expect(result).toContain('78')
})

test('formattedInspect handles unquoted option', () => {
  const objResult = formattedInspect({ a: 1 }, { colors: noColors, unquoted: true })
  expect(objResult).toContain('a')
  expect(objResult).toContain('1')

  const arrResult = formattedInspect([1, 2], { colors: noColors, unquoted: true })
  expect(arrResult).toContain('1')
  expect(arrResult).toContain('2')
})

test('formattedInspect handles json option', () => {
  const result1 = formattedInspect({ a: 'hello' }, { colors: noColors, json: true })
  expect(result1).toContain('a')
  expect(result1).toContain('hello')

  const result2 = formattedInspect({ a: 'hello' }, { colors: noColors, json: true }, 1)
  expect(result2).toContain('a')
  expect(result2).toContain('hello')
})

const expectJsonParseable = (result: string) => {
  const raw = stripAnsi(result)
  try {
    JSON.parse(raw)
  } catch (e) {
    throw new Error(`JSON.parse failed: ${raw} => ${e}`)
  }
}

test('formattedInspect JSON output is parseable', () => {
  // Test primitive values
  const stringResult = formattedInspect('hello', { json: true })
  expectJsonParseable(stringResult)

  const numberResult = formattedInspect(42, { json: true })
  expectJsonParseable(numberResult)

  const booleanResult = formattedInspect(true, { json: true })
  expectJsonParseable(booleanResult)

  // Test arrays
  const arrayResult = formattedInspect([1, 'two', true], { json: true })
  expectJsonParseable(arrayResult)

  // Test objects
  const objectResult = formattedInspect({ a: 1, b: 'hello', c: true }, { json: true })
  expectJsonParseable(objectResult)

  // Test nested structures
  const nestedResult = formattedInspect({
    users: [
      { name: 'alice', scores: [85, 92] },
      { name: 'bob', scores: [78, 88] }
    ],
    metadata: { total: 2, average: 85.75 }
  }, { json: true })
  expectJsonParseable(nestedResult)

  // Test null and undefined
  const nullResult = formattedInspect(null, { json: true })
  expectJsonParseable(nullResult)

  const undefinedResult = formattedInspect(undefined, { json: true })
  expectJsonParseable(undefinedResult)
})

test('formattedInspect handles mixed data structures', () => {
  const complex = {
    users: [
      { name: 'alice', scores: [85, 92] },
      { name: 'bob', scores: [78, 88] }
    ],
    metadata: {
      total: 2,
      average: 85.75
    }
  }
  const result = formattedInspect(complex, { colors: noColors })
  expect(result).toContain('users')
  expect(result).toContain('alice')
  expect(result).toContain('bob')
  expect(result).toContain('85')
  expect(result).toContain('92')
  expect(result).toContain('78')
  expect(result).toContain('88')
  expect(result).toContain('metadata')
  expect(result).toContain('total')
  expect(result).toContain('2')
  expect(result).toContain('average')
  expect(result).toContain('85.75')
})

test('formattedInspect handles unknown types', () => {
  const func = () => 'test'
  expect(formattedInspect(func, { colors: noColors })).toContain('test')

  const symbol = Symbol('test')
  expect(formattedInspect(symbol, { colors: noColors })).toContain('test')
})

test('formattedInspect with default options', () => {
  expect(formattedInspect('test')).toContain('test')
  expect(formattedInspect(123)).toContain('123')
  expect(formattedInspect({ a: 1 })).toContain('a')
  expect(formattedInspect({ a: 1 })).toContain('1')
})

