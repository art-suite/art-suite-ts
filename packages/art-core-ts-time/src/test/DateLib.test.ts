import { describe, it, expect } from 'vitest'
import { toSeconds, toMilliseconds, toDate, formatDate, firstOfHour, firstOfDay, firstOfWeek, firstOfMonth, firstOfYear, firstOfDayLocale, firstOfWeekLocale, firstOfMonthLocale, firstOfYearLocale } from '../index'

describe('toSeconds', () => {
  it('should convert Date to seconds', () => {
    const date = new Date()
    expect(toSeconds(date)).toBe(date.getTime() / 1000)
  })

  it('with no argument', () => {
    expect(Math.abs(toSeconds() - Date.now() / 1000)).toBeLessThan(0.001)
  })

  it('should handle string dates', () => {
    const expected = new Date(2025, 0, 2).getTime() / 1000
    expect(toSeconds('2025-01-02')).toBe(expected)
  })
})

describe('toMilliseconds', () => {
  it('should convert Date to milliseconds', () => {
    const date = new Date()
    expect(toMilliseconds(date)).toBe(date.getTime())
  })

  it('with no argument', () => {
    expect(Math.abs(toMilliseconds() - Date.now())).toBeLessThan(1000)
  })

  it('with milliseconds number', () => {
    expect(toMilliseconds(1234567890000)).toBe(1234567890000)
  })

  it('with seconds number', () => {
    expect(toMilliseconds(1234567)).toBe(1234567000)
  })

  it('with string', () => {
    const expected = new Date(2025, 0, 2).getTime()
    expect(toMilliseconds('2025-01-02')).toBe(expected)
  })

  it('with date', () => {
    const expected = new Date('2025-01-02').getTime()
    expect(toMilliseconds(new Date('2025-01-02'))).toBe(expected)
  })

  it('should throw on invalid input', () => {
    expect(() => toMilliseconds({} as any)).toThrow('invalid timestamp value')
  })

  it('with string that is just a number', () => {
    expect(toMilliseconds('1234567890000')).toBe(1234567890000)
  })

  it('with string in an unrecognized date format, falls back to better parser', () => {
    // Example: '2024/07/01 12:34:56' is not ISO, but is a common format
    const input = '2024/07/01 12:34:56'
    const expected = new Date('2024-07-01T12:34:56').getTime() // fallback parser should parse this
    expect(toMilliseconds(input)).toBe(expected)
  })
})

describe('toDate', () => {
  it('should convert seconds to Date', () => {
    const seconds = Date.now() / 1000
    expect(toDate(seconds).getTime()).toBe(new Date(seconds * 1000).getTime())
  })

  it('with no argument', () => {
    const now = new Date()
    const result = toDate()
    expect(Math.abs(result.getTime() - now.getTime())).toBeLessThan(1000)
  })

  it('should handle string dates', () => {
    const expected = new Date(2025, 0, 2).getTime()
    expect(toSeconds('2025-01-02')).toBe(expected / 1000)
  })
})

describe('formatDate', () => {
  it('should format Date', () => {
    const date = new Date('2025-01-02')
    expect(formatDate(date, 'yyyy-MM-dd')).toBe('2025-01-02')
  })

  it('with no argument', () => {
    const result = formatDate()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/)
  })

  it('with just format', () => {
    const result = formatDate(new Date(), 'yyyy-MM-dd')
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('with format and date', () => {
    expect(formatDate(new Date('2025-01-02'), 'yyyy-MM-dd')).toBe('2025-01-02')
  })

  it('should handle UTC formatting', () => {
    const date = new Date('2025-01-02T12:00:00Z')
    expect(formatDate(date, 'yyyy-MM-dd\'T\'HH:mm:ssXXX', true)).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/)
  })

  it('with only format string', () => {
    const expected = new Date().toISOString().slice(0, 10) // yyyy-MM-dd
    expect(formatDate('yyyy-MM-dd')).toBe(expected)
  })
})

describe('firstOf functions', () => {
  const testDate = new Date('2025-01-15T14:30:45.123Z')

  describe('UTC functions', () => {
    it('firstOfHour', () => {
      const result = new Date(firstOfHour(testDate) * 1000)
      expect(result.toISOString()).toBe('2025-01-15T14:00:00.000Z')
    })

    it('firstOfDay', () => {
      const result = new Date(firstOfDay(testDate) * 1000)
      expect(result.toISOString()).toBe('2025-01-15T00:00:00.000Z')
    })

    it('firstOfWeek', () => {
      const result = new Date(firstOfWeek(testDate) * 1000)
      expect(result.toISOString()).toBe('2025-01-13T00:00:00.000Z') // Monday
    })

    it('firstOfMonth', () => {
      const result = new Date(firstOfMonth(testDate) * 1000)
      expect(result.toISOString()).toBe('2025-01-01T00:00:00.000Z')
    })

    it('firstOfYear', () => {
      const result = new Date(firstOfYear(testDate) * 1000)
      expect(result.toISOString()).toBe('2025-01-01T00:00:00.000Z')
    })
  })

  describe('Locale functions', () => {
    it('firstOfDayLocale', () => {
      const result = new Date(firstOfDayLocale(testDate) * 1000)
      expect(result.getHours()).toBe(0)
      expect(result.getMinutes()).toBe(0)
      expect(result.getSeconds()).toBe(0)
    })

    it('firstOfWeekLocale', () => {
      const result = new Date(firstOfWeekLocale(testDate) * 1000)
      expect(result.getDay()).toBe(1) // Monday
    })

    it('firstOfWeekLocale with sunday first', () => {
      const result = new Date(firstOfWeekLocale(testDate, true) * 1000)
      expect(result.getDay()).toBe(0) // Sunday
    })

    it('firstOfMonthLocale', () => {
      const result = new Date(firstOfMonthLocale(testDate) * 1000)
      expect(result.getDate()).toBe(1)
      expect(result.getHours()).toBe(0)
    })

    it('firstOfYearLocale', () => {
      const result = firstOfYearLocale(testDate)
      expect(result.getFullYear()).toBe(2025)
      expect(result.getMonth()).toBe(0)
      expect(result.getDate()).toBe(1)
    })
  })
})
