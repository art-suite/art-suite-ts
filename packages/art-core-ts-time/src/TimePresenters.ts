import { toSeconds, toDate, formatDate } from './DateLib.js'
import { secondsPer } from './TimeConstants.js'
import { AnyDateType } from './DateLib.js'

type TimeUnit = 'ms' | 's' | 'm' | 'h' | 'd' | 'mo' | 'y'
type TimeOptions = {
  verbose?: boolean
  precision?: number
  now?: AnyDateType
}

const longTimeNames: Record<TimeUnit, string> = {
  ms: 'millisecond',
  s: 'second',
  m: 'minute',
  h: 'hour',
  d: 'day',
  mo: 'month',
  y: 'year'
}

const pluralize = (n: number, word: string): string =>
  n === 1 ? word : `${word}s`

const humanDurationStringHelper = (number: number, unit: TimeUnit, verbose?: boolean): string =>
  verbose ? `${number} ${pluralize(number, longTimeNames[unit])}` : `${number}${unit}`

export const dateAgeInSeconds = (date: AnyDateType, now: AnyDateType = new Date()): number =>
  toSeconds(now) - toSeconds(date)

export const humanDurationString = (seconds: number, { verbose, precision = 1 }: TimeOptions = {}): string => {
  if (precision > 1) {
    const units: TimeUnit[] =
      seconds < secondsPer.m ? ['s'] :
        seconds < secondsPer.h ? ['m', 's'] :
          seconds < secondsPer.d ? ['h', 'm', 's'] :
            seconds < secondsPer.mo ? ['d', 'h', 'm', 's'] :
              seconds < secondsPer.y ? ['mo', 'd', 'h', 'm', 's'] :
                ['y', 'mo', 'd', 'h', 'm', 's']

    return units.slice(0, precision).map((unit, i) => {
      const number = seconds / secondsPer[unit]
      const roundedNumber = i === precision - 1 ? Math.round(number) : Math.floor(number)
      seconds %= secondsPer[unit]
      return humanDurationStringHelper(roundedNumber, unit, verbose)
    }).join(' ')
  }

  const unit: TimeUnit =
    seconds < secondsPer.m ? 's' :
      seconds < 3 * secondsPer.h ? 'm' :
        seconds < 3 * secondsPer.d ? 'h' :
          seconds < 3 * secondsPer.mo ? 'd' :
            seconds < 2 * secondsPer.y ? 'mo' : 'y'

  const number = Math.round(seconds / secondsPer[unit])
  return humanDurationStringHelper(number, unit, verbose)
}

export const humanTimeDeltaString = (date1: AnyDateType, date2: AnyDateType, options: TimeOptions = {}): string =>
  humanDurationString(
    dateAgeInSeconds(date1, date2),
    options
  )

export const niceFullDateString = (date: AnyDateType): string =>
  formatDate(date, "h:mma MMMM d, yyyy").replace(/AM|PM/, m => m.toLowerCase())

export const niceMonthYear = (date: AnyDateType): string =>
  formatDate(date, "MMMM yyyy")

export const niceDateString = (date: AnyDateType, now: AnyDateType = new Date()): string => {
  now = toDate(now)
  date = toDate(date)

  const daysDiff = Math.round((toSeconds(date) - toSeconds(now)) / secondsPer.day)

  if (daysDiff === 1) return 'tomorrow'
  if (daysDiff === -1) return 'yesterday'
  if (daysDiff === 0) return 'today'

  if (now.getFullYear() !== date.getFullYear())
    return formatDate(date, "MMMM d, yyyy")
  if (now.getMonth() !== date.getMonth())
    return formatDate(date, "MMMM d")
  return formatDate(date, "MMMM d")
}

export const niceTimeDetailsString = (date: AnyDateType, now: AnyDateType = new Date()): string =>
  `${formatDate(date, "h:mma").replace(/AM|PM/, m => m.toLowerCase())} ${niceDateString(date, now)}`

export const timeAgo = (date: AnyDateType, { verbose, precision = 1, now = toDate() }: TimeOptions = {}): string => {
  const ageInSeconds = dateAgeInSeconds(date, now)

  if (ageInSeconds < 0) {
    const prefix = verbose ? "in " : "-"
    return prefix + humanDurationString(-ageInSeconds, { verbose, precision })
  }

  const ageInMinutes = ageInSeconds / secondsPer.minute
  if (ageInMinutes < 1 && !(precision > 1)) return "just now"

  const minPlural = humanDurationString(ageInSeconds, { verbose, precision })
  return verbose ? `${minPlural} ago` : minPlural
}
