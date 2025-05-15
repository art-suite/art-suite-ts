import { format as dateFnsFormat, formatInTimeZone as dateFnsTzFormat } from 'date-fns-tz'
import { secondsPer } from './TimeConstants.js'
import { parse as dateFnsParse } from 'date-fns'

const march1973InMilliseconds = 100000000000

const isString = (v: any): v is string => typeof v === 'string'
const isNumber = (v: any): v is number => typeof v === 'number'
const isDate = (v: any): v is Date => v instanceof Date

const DEFAULT_FORMAT = 'yyyy-MM-dd\'T\'HH:mm:ssXXX'

export type AllDateTypes = Date | string | number | null | undefined

export const formatDate = (value?: AllDateTypes, format?: string, utc?: boolean): string => {
  if (isString(value) && !isString(format)) {
    format = value
    value = null
  }
  if (utc) {
    return dateFnsTzFormat(toDate(value), 'UTC', format ?? 'yyyy-MM-dd\'T\'HH:mm:ssXXX')
  }
  return dateFnsFormat(toDate(value), format ?? DEFAULT_FORMAT)
}

/**
 * Converts various input types to milliseconds since epoch
 * @param v Input value:
 *   - Date
 *   - Number of Seconds since epoch-start
 *   - Number of Milliseconds since epoch-start
 *   - String:
 *     - if contains only digits with optional decimal (e.g. "123" or "123.456") -> toMilliseconds(v - 0)
 *     - else -> toMilliseconds(Date.parse(v))
 * @returns Number of Milliseconds since epoch-start
 */
export const toMilliseconds = (v?: AllDateTypes): number => {
  if (!v) return Date.now()

  if (isString(v)) {
    const match = v.match(/^(\d\d\d\d)-(\d\d)(?:-(\d\d))?$/)
    if (match) {
      const [_, year, month, day = 1] = match
      v = new Date(Number(year), Number(month) - 1, Number(day))
    } else if (/^\d+(\.\d+)?$/.test(v)) {
      v = Number(v)
    } else {
      // Try date-fns parse with a few common formats, fallback to Date.parse
      let parsed = dateFnsParse(v, 'yyyy-MM-dd HH:mm:ss', new Date())
      if (isNaN(parsed.getTime())) parsed = dateFnsParse(v, 'yyyy/MM/dd HH:mm:ss', new Date())
      if (isNaN(parsed.getTime())) parsed = dateFnsParse(v, 'yyyy-MM-dd', new Date())
      if (isNaN(parsed.getTime())) parsed = dateFnsParse(v, 'yyyy/MM/dd', new Date())
      if (isNaN(parsed.getTime())) parsed = new Date(Date.parse(v))
      v = parsed
    }
  }

  if (isNumber(v)) {
    if (!isFinite(v)) throw new Error(`toMilliseconds(${v}) - number is not finite`)

    if (v < march1973InMilliseconds) {
      // assuming its a Seconds timestamp
      // range: 1970-01-01 to 5138-11-16
      return v * 1000
    } else {
      // assuming its a Milliseconds timestamp
      // range: 1973-03-03 to JavaScript max-date
      return v
    }
  }

  if (isDate(v)) return v.getTime()
  throw new Error(`invalid timestamp value: ${v}`)
}

/**
 * Converts various input types to seconds since epoch
 * @param v Input value:
 *   - Date
 *   - Number of Seconds since epoch-start
 *   - Number of Milliseconds since epoch-start
 * @returns (fractional) Number of Seconds since epoch-start
 */
export const toSeconds = (v?: AllDateTypes): number => {
  if (!v) return Date.now() / 1000
  return toMilliseconds(v) / 1000
}

export const toDate = (v?: AllDateTypes): Date => {
  if (!v) return new Date()
  if (isDate(v)) return v
  return new Date(toMilliseconds(v))
}

export const firstOfHour = (time: AllDateTypes): number =>
  Math.floor(toSeconds(time) / secondsPer.hour) * secondsPer.hour

export const firstOfDay = (time: AllDateTypes): number =>
  Math.floor(toSeconds(time) / secondsPer.day) * secondsPer.day

export const firstOfWeek = (time: AllDateTypes): number =>
  firstOfDay(time) - ((toDate(time).getUTCDay() - 1) % 7) * secondsPer.day // monday is first day

export const firstOfMonth = (time: AllDateTypes): number =>
  firstOfDay(time) - (toDate(time).getUTCDate() - 1) * secondsPer.day

// firstOfYear: using 3rd day of the month avoids any and all time-zone issues after applying firstOfMonth
export const firstOfYear = (time: AllDateTypes): number =>
  firstOfMonth(new Date(toDate(time).getUTCFullYear(), 0, 3))

export const firstOfDayLocale = (time: AllDateTypes): number =>
  firstOfHour(time) - toDate(time).getHours() * secondsPer.hour

export const firstOfWeekLocale = (time: AllDateTypes, sundayIsFirst = false): number => {
  const day = toDate(time).getDay()
  const adjustedDay = sundayIsFirst ? day : day - 1
  return firstOfDayLocale(time) - secondsPer.day * (adjustedDay % 7)
}

export const firstOfMonthLocale = (time: AllDateTypes): number =>
  firstOfDayLocale(time) - (toDate(time).getDate() - 1) * secondsPer.day

export const firstOfYearLocale = (time: AllDateTypes): Date => {
  const date = toDate(time)
  return new Date(date.getFullYear(), 0, 1)
}
