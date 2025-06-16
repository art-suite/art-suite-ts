import { describe, it, expect } from 'vitest'
import { commaize, pluralize, randomString, cryptoRandomString } from '../index.ts'

describe('commaize', () => {
  it('should commaize a number', () => {
    expect(commaize(1000)).toBe('1,000')
  })
})

describe('pluralize', () => {
  it('should pluralize a word', () => {
    expect(pluralize('person')).toBe('people')
  })

  it('should handle singular count', () => expect(pluralize('person', 1)).toBe('1 person'))
  it('should handle plural count', () => expect(pluralize('person', 2)).toBe('2 people'))
  it('should handle zero count', () => expect(pluralize('person', 0)).toBe('0 people'))
  it('should handle singular count with custom plural', () => expect(pluralize('person', 1, 'persons')).toBe('1 person'))
  it('should handle plural count with custom plural', () => expect(pluralize('person', 2, 'persons')).toBe('2 persons'))
  it('should handle zero count with custom plural', () => expect(pluralize('person', 0, 'persons')).toBe('0 persons'))

  it('should pluralize a word (swapped params)', () => {
    expect(pluralize('person')).toBe('people')
  })

  it('should handle singular count (swapped params)', () => expect(pluralize(1, 'person')).toBe('1 person'))
  it('should handle plural count (swapped params)', () => expect(pluralize(2, 'person')).toBe('2 people'))
  it('should handle zero count (swapped params)', () => expect(pluralize(0, 'person')).toBe('0 people'))
  it('should handle singular count with custom plural (swapped params)', () => expect(pluralize(1, 'person', 'persons')).toBe('1 person'))
  it('should handle plural count with custom plural (swapped params)', () => expect(pluralize(2, 'person', 'persons')).toBe('2 persons'))
  it('should handle zero count with custom plural (swapped params)', () => expect(pluralize(0, 'person', 'persons')).toBe('0 persons'))

  it('should pluralize a word with underscore', () => {
    expect(pluralize('person_')).toBe('people_')
    expect(pluralize('person_', 1)).toBe('1 person_')
    expect(pluralize('person_', 2)).toBe('2 people_')
    expect(pluralize('person_', 0)).toBe('0 people_')
  })
  it('should pluralize a word with dash', () => {
    expect(pluralize('person-')).toBe('people-')
    expect(pluralize('person-', 1)).toBe('1 person-')
    expect(pluralize('person-', 2)).toBe('2 people-')
    expect(pluralize('person-', 0)).toBe('0 people-')
  })
  it('should pluralize a word with multiple trailing non-word chars', () => {
    expect(pluralize('person_-')).toBe('people_-')
    expect(pluralize('person_-', 1)).toBe('1 person_-')
    expect(pluralize('person_-', 2)).toBe('2 people_-')
    expect(pluralize('person_-', 0)).toBe('0 people_-')
  })

})

describe('randomString', () => {
  it('should generate a random string', () => {
    expect(randomString()).toBeDefined()
  })
  it('should generate a random string with a custom length', () => {
    const s = randomString(10)
    expect(s.length).toBe(10)
  })
  it('should generate a random string with a custom characters', () => {
    const s = randomString(10, 'abcdefghijklmnopqrstuvwxyz')
    expect(s.length).toBe(10)
    expect(s).toMatch(/^[a-z]+$/)
  })
  it('should generate a random string with a custom random numbers', () => {
    const s = randomString(10, 'abcdefghijklmnopqrstuvwxyz', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(s.length).toBe(10)
    expect(s).toEqual('bcdefghijk')
  })

})
describe('cryptoRandomString', () => {
  it('should generate a random string', () => {
    expect(cryptoRandomString()).toBeDefined()
  })
  it('should generate a random string with a custom length', () => {
    const s = cryptoRandomString(10)
    expect(s.length).toBe(10)
  })
})