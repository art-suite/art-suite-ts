import { describe, it, expect } from 'vitest'
import { humanDurationString, timeAgo, humanTimeDeltaString, niceDateString, niceFullDateString, niceTimeDetailsString, niceMonthYear, secondsPer } from '../index'

const now = new Date('2024-07-01T12:35:00')

const humanDurationStringTester = (options: any, testMap: Record<number, string>) => {
  Object.entries(testMap).forEach(([seconds, expected]) => {
    it(`${seconds}s => ${expected}`, () => {
      expect(humanDurationString(Number(seconds), options)).toBe(expected)
    })
  })
}

const timeAgoTester = (options: any, testMap: Record<number, string>) => {
  Object.entries(testMap).forEach(([seconds, expected]) => {
    const testDate = new Date(now.getTime() - Number(seconds) * 1000)
    it(`${seconds}s ago => ${expected}`, () => {
      expect(timeAgo(testDate, { ...options, now })).toBe(expected)
    })
  })
}

describe('timeAgo', () => {
  const options = { now }
  it('1 second from now', () => {
    expect(timeAgo(new Date(now.getTime() + 1 * 1000), options)).toBe('-1s')
  })
  it('a second ago', () => {
    expect(timeAgo(now, options)).toBe('just now')
  })
  it('10 seconds ago', () => {
    expect(timeAgo(new Date(now.getTime() - 10 * 1000), options)).toBe('just now')
  })
  it('a minute ago', () => {
    expect(timeAgo(new Date(now.getTime() - secondsPer.m * 1000), options)).toBe('1m')
  })
  it('an hour ago', () => {
    expect(timeAgo(new Date(now.getTime() - secondsPer.h * 1000), options)).toBe('60m')
  })
  it('a day ago', () => {
    expect(timeAgo(new Date(now.getTime() - secondsPer.d * 1000), options)).toBe('24h')
  })
})

describe('timeAgo precision: 2', () => {
  timeAgoTester({ now, precision: 2 }, {
    [-1]: '-1s',
    1: '1s',
    10: '10s',
    59: '59s',
    60: '1m 0s',
    61: '1m 1s',
    3600: '1h 0m',
    [secondsPer.d]: '1d 0h',
  })
})

describe('timeAgo verbose', () => {
  timeAgoTester({ now, verbose: true }, {
    [-1]: 'in 1 second',
    1: 'just now',
    10: 'just now',
    60: '1 minute ago',
    3600: '60 minutes ago',
    [secondsPer.d]: '24 hours ago',
  })
})

describe('humanDurationString', () => {
  it('a second', () => expect(humanDurationString(1)).toBe('1s'))
  it('10 seconds', () => expect(humanDurationString(10)).toBe('10s'))
  it('a minute', () => expect(humanDurationString(secondsPer.m)).toBe('1m'))
  it('an hour', () => expect(humanDurationString(secondsPer.h)).toBe('60m'))
  it('2 hours', () => expect(humanDurationString(secondsPer.h * 2)).toBe('120m'))
  it('3 hours', () => expect(humanDurationString(secondsPer.h * 3)).toBe('3h'))
  it('a day', () => expect(humanDurationString(secondsPer.d)).toBe('24h'))
  it('2 days', () => expect(humanDurationString(secondsPer.d * 2)).toBe('48h'))
  it('3 days', () => expect(humanDurationString(secondsPer.d * 3)).toBe('3d'))
  it('a month', () => expect(humanDurationString(secondsPer.mo)).toBe('30d'))
  it('2 months', () => expect(humanDurationString(secondsPer.mo * 2)).toBe('61d'))
  it('3 months', () => expect(humanDurationString(secondsPer.mo * 3)).toBe('3mo'))
  it('a year', () => expect(humanDurationString(secondsPer.y)).toBe('12mo'))
  it('2 years', () => expect(humanDurationString(secondsPer.y * 2)).toBe('2y'))
})

describe('humanDurationString precision: 2', () => {
  humanDurationStringTester({ precision: 2 }, {
    1: '1s',
    59: '59s',
    60: '1m 0s',
    [secondsPer.h]: '1h 0m',
    [secondsPer.h + 29]: '1h 0m',
    [secondsPer.h + 30]: '1h 1m',
    [secondsPer.h + secondsPer.m * 59]: '1h 59m',
    [2 * secondsPer.h]: '2h 0m',
    [2 * secondsPer.h + secondsPer.m]: '2h 1m',
    [24 * secondsPer.h]: '1d 0h',
    [2 * secondsPer.d]: '2d 0h',
    [2 * secondsPer.mo]: '2mo 0d',
    [2 * secondsPer.y]: '2y 0mo',
  })
})

describe('humanTimeDeltaString', () => {
  it('1 second', () => expect(humanTimeDeltaString(now, new Date(now.getTime() + 1 * 1000))).toBe('1s'))
  it('1 minute', () => expect(humanTimeDeltaString(now, new Date(now.getTime() + secondsPer.m * 1000))).toBe('1m'))
  it('60m', () => expect(humanTimeDeltaString(now, new Date(now.getTime() + secondsPer.h * 1000))).toBe('60m'))
  it('61m', () => expect(humanTimeDeltaString(now, new Date(now.getTime() + (secondsPer.h + 60) * 1000))).toBe('61m'))
  it('61m precision:2', () => expect(humanTimeDeltaString(now, new Date(now.getTime() + (secondsPer.h + 60) * 1000), { precision: 2 })).toBe('1h 1m'))
  it('120m', () => expect(humanTimeDeltaString(now, new Date(now.getTime() + secondsPer.h * 2 * 1000))).toBe('120m'))
  it('24 hours verbose', () => expect(humanTimeDeltaString(now, new Date(now.getTime() + secondsPer.d * 1000), { verbose: true })).toBe('24 hours'))
  it('1 day 1 hour', () => expect(humanTimeDeltaString(now, new Date(now.getTime() + (secondsPer.d + secondsPer.h) * 1000), { precision: 2 })).toBe('1d 1h'))
})

describe('humanDurationString verbose: true', () => {
  humanDurationStringTester({ verbose: true }, {
    1: '1 second',
    59: '59 seconds',
    60: '1 minute',
  })
})

describe('niceDateString', () => {
  it('today', () => expect(niceDateString(now, now)).toBe('today'))
  it('yesterday', () => expect(niceDateString(new Date(now.getTime() - secondsPer.d * 1000), now)).toBe('yesterday'))
  it('tomorrow', () => expect(niceDateString(new Date(now.getTime() + secondsPer.d * 1000), now)).toBe('tomorrow'))
  it('last month', () => expect(niceDateString(new Date(now.getTime() - secondsPer.mo * 1000), now)).toBe('June 1'))
  it('next month', () => expect(niceDateString(new Date(now.getTime() + 31 * secondsPer.d * 1000), now)).toBe('August 1'))
  it('last year', () => expect(niceDateString(new Date(now.getTime() - secondsPer.y * 1000), now)).toBe('July 2, 2023'))
})

describe('niceFullDateString', () => {
  it('today', () => expect(niceFullDateString(now)).toBe('12:35pm July 1, 2024'))
})

describe('niceTimeDetailsString', () => {
  it('today', () => expect(niceTimeDetailsString(now, new Date(now.getTime() + secondsPer.mo * 1000))).toBe('12:35pm July 1'))
})

describe('niceMonthYear', () => {
  it('today', () => expect(niceMonthYear(now)).toBe('July 2024'))
})