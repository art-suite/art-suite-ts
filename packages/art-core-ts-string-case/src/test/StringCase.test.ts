import { describe, it, expect } from 'vitest'
import {
  getCodeWords,
  lowerCase,
  upperCase,
  capitalize,
  decapitalize,
  getLowerCaseCodeWords,
  getUpperCaseCodeWords,
  getCapitalizedCodeWords,
  upperCamelCase,
  lowerCamelCase,
  snakeCase,
  upperSnakeCase,
  dashCase,
  capitalizedDashCase
} from '../StringCase'

describe('StringCase', () => {
  describe('getCodeWords', () => {
    it('splits camelCase into words', () => {
      expect(getCodeWords('camelCase')).toEqual(['camel', 'Case'])
      expect(getCodeWords('camelCaseTest')).toEqual(['camel', 'Case', 'Test'])
    })

    it('splits snake_case into words', () => {
      expect(getCodeWords('snake_case')).toEqual(['snake', 'case'])
      expect(getCodeWords('snake_case_test')).toEqual(['snake', 'case', 'test'])
    })

    it('splits dash-case into words', () => {
      expect(getCodeWords('dash-case')).toEqual(['dash', 'case'])
      expect(getCodeWords('dash-case-test')).toEqual(['dash', 'case', 'test'])
    })

    it('handles mixed cases', () => {
      expect(getCodeWords('mixed-case_WithCamel')).toEqual(['mixed', 'case', 'With', 'Camel'])
    })

    it('handles numbers', () => {
      expect(getCodeWords('test123')).toEqual(['test123'])
      expect(getCodeWords('123test')).toEqual(['123', 'test'])
    })

    it('handles empty string', () => {
      expect(getCodeWords('')).toEqual([])
    })

    it('handles array input', () => {
      expect(getCodeWords(['foo', 'bar'])).toEqual(['foo', 'bar'])
      expect(getCodeWords(['foo123', 'bar_baz'])).toEqual(['foo123', 'bar', 'baz'])
    })
  })

  describe('lowerCase', () => {
    it('converts to lowercase', () => {
      expect(lowerCase('TEST')).toBe('test')
      expect(lowerCase('Test')).toBe('test')
      expect(lowerCase('test')).toBe('test')
    })

    it('handles null/undefined', () => {
      expect(lowerCase(null)).toBe(undefined)
      expect(lowerCase(undefined)).toBe(undefined)
    })
  })

  describe('upperCase', () => {
    it('converts to uppercase', () => {
      expect(upperCase('test')).toBe('TEST')
      expect(upperCase('Test')).toBe('TEST')
      expect(upperCase('TEST')).toBe('TEST')
    })

    it('handles null/undefined', () => {
      expect(upperCase(null)).toBe(undefined)
      expect(upperCase(undefined)).toBe(undefined)
    })
  })

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('test')).toBe('Test')
      expect(capitalize('Test')).toBe('Test')
      expect(capitalize('TEST')).toBe('TEST')
    })

    it('handles null/undefined', () => {
      expect(capitalize(null)).toBe(null)
      expect(capitalize(undefined)).toBe(undefined)
    })
  })

  describe('decapitalize', () => {
    it('decapitalizes first letter', () => {
      expect(decapitalize('Test')).toBe('test')
      expect(decapitalize('test')).toBe('test')
      expect(decapitalize('TEST')).toBe('tEST')
    })

    it('handles null/undefined', () => {
      expect(decapitalize(null)).toBe(null)
      expect(decapitalize(undefined)).toBe(undefined)
    })
  })

  describe('case transformations', () => {
    const testCases = [
      {
        input: 'camelCase',
        expected: {
          lowerCamel: 'camelCase',
          upperCamel: 'CamelCase',
          snake: 'camel_case',
          upperSnake: 'CAMEL_CASE',
          dash: 'camel-case',
          capitalizedDash: 'Camel-Case'
        }
      },
      {
        input: 'snake_case',
        expected: {
          lowerCamel: 'snakeCase',
          upperCamel: 'SnakeCase',
          snake: 'snake_case',
          upperSnake: 'SNAKE_CASE',
          dash: 'snake-case',
          capitalizedDash: 'Snake-Case'
        }
      },
      {
        input: 'dash-case',
        expected: {
          lowerCamel: 'dashCase',
          upperCamel: 'DashCase',
          snake: 'dash_case',
          upperSnake: 'DASH_CASE',
          dash: 'dash-case',
          capitalizedDash: 'Dash-Case'
        }
      },
      {
        input: 'mixed-case_WithCamel',
        expected: {
          lowerCamel: 'mixedCaseWithCamel',
          upperCamel: 'MixedCaseWithCamel',
          snake: 'mixed_case_with_camel',
          upperSnake: 'MIXED_CASE_WITH_CAMEL',
          dash: 'mixed-case-with-camel',
          capitalizedDash: 'Mixed-Case-With-Camel'
        }
      },
      {
        input: 'foo123Bar_baz',
        expected: {
          lowerCamel: 'foo123BarBaz',
          upperCamel: 'Foo123BarBaz',
          snake: 'foo123_bar_baz',
          upperSnake: 'FOO123_BAR_BAZ',
          dash: 'foo123-bar-baz',
          capitalizedDash: 'Foo123-Bar-Baz'
        }
      }
    ]

    testCases.forEach(({ input, expected }) => {
      describe(`input: ${input}`, () => {
        it('transforms to lowerCamelCase', () => {
          expect(lowerCamelCase(input)).toBe(expected.lowerCamel)
        })

        it('transforms to upperCamelCase', () => {
          expect(upperCamelCase(input)).toBe(expected.upperCamel)
        })

        it('transforms to snake_case', () => {
          expect(snakeCase(input)).toBe(expected.snake)
        })

        it('transforms to UPPER_SNAKE_CASE', () => {
          expect(upperSnakeCase(input)).toBe(expected.upperSnake)
        })

        it('transforms to dash-case', () => {
          expect(dashCase(input)).toBe(expected.dash)
        })

        it('transforms to Capitalized-Dash-Case', () => {
          expect(capitalizedDashCase(input)).toBe(expected.capitalizedDash)
        })
      })
    })
  })

  describe('custom joiners', () => {
    it('allows custom joiners for all case types', () => {
      const input = 'testCase'
      expect(upperCamelCase(input, ' ')).toBe('Test Case')
      expect(lowerCamelCase(input, ' ')).toBe('test Case')
      expect(snakeCase(input, '|')).toBe('test|case')
      expect(upperSnakeCase(input, '|')).toBe('TEST|CASE')
      expect(dashCase(input, ' ')).toBe('test case')
      expect(capitalizedDashCase(input, ' ')).toBe('Test Case')
    })
  })
})
