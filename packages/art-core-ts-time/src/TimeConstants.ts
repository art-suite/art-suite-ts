import { object } from '@art-suite/art-core-ts-comprehensions';

export const longTimeNames = {
  ns: "nanosecond",
  μs: "microsecond",
  ms: "millisecond",
  s: "second",
  m: "minute",
  h: "hour",
  d: "day",
  w: "week",
  mo: "month",
  y: "year",
  nanosecond: "nanosecond",
  microsecond: "microsecond",
  millisecond: "millisecond",
  second: "second",
  minute: "minute",
  hour: "hour",
  day: "day",
  week: "week",
  month: "month",
  year: "year",
};

export type TimeUnit = keyof typeof longTimeNames;

export const secondsPer: Record<TimeUnit, number> = {
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
};

export const millisecondsPer: Record<TimeUnit, number> = object(secondsPer, value => value * 1000) as Record<TimeUnit, number>;
export const minutesPer: Record<TimeUnit, number> = object(secondsPer, value => value / 60) as Record<TimeUnit, number>;
export const hoursPer: Record<TimeUnit, number> = object(secondsPer, value => value / 3600) as Record<TimeUnit, number>;
export const daysPer: Record<TimeUnit, number> = object(secondsPer, value => value / 86400) as Record<TimeUnit, number>;
export const weeksPer: Record<TimeUnit, number> = object(secondsPer, value => value / 604800) as Record<TimeUnit, number>;
export const monthsPer: Record<TimeUnit, number> = object(secondsPer, value => value / 2592000) as Record<TimeUnit, number>;
export const yearsPer: Record<TimeUnit, number> = object(secondsPer, value => value / 31556926) as Record<TimeUnit, number>;
