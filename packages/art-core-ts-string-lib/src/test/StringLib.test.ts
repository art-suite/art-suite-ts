import { describe, it, expect } from 'vitest'
import { commaize, pluralize } from '../index.ts'

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