
export const longTimeNames = {
  ns: "nanosecond",
  μs: "microsecond",
  ms: "millisecond",
  s: "second",
  m: "minute",
  h: "hour",
  d: "day",
  mo: "month",
  y: "year",
  w: "week",
  nanosecond: "nanosecond",
  microsecond: "microsecond",
  millisecond: "millisecond",
  second: "second",
  minute: "minute",
  hour: "hour",
  day: "day",
  month: "month",
  year: "year",
  week: "week",
}

export const secondsPer: Record<string, number> = {
  ns: .000000001,
  μs: .000001,
  ms: .001,
  s: 1,
  m: 60,
  h: 3600,
  d: 24 * 3600,
  w: 24 * 3600 * 7,
  mo: 24 * 3600 * 365.2425 / 12,
  y: 24 * 3600 * 365.2425,
  nanosecond: .000000001,
  microsecond: .000001,
  millisecond: .001,
  second: 1,
  minute: 60,
  hour: 3600,
  day: 24 * 3600,
  month: 24 * 3600 * 365.2425 / 12,
  year: 24 * 3600 * 365.2425,
  week: 24 * 3600 * 7,
}
