import { formattedInspect, FormattedInspectOptions } from './formattedInspect'
import { defaultColors, InspectColors, noColors } from './colors'

type LogFn = (<T>(...args: T[]) => T) & {
  warn: <T>(...args: T[]) => T
  error: <T>(...args: T[]) => T
  unquoted: <T>(...args: T[]) => T
  json: <T>(...args: T[]) => T
}

const isNode = typeof process !== 'undefined' && process.versions?.node != null
const colorsEnabled = isNode
let colors = colorsEnabled ? defaultColors : noColors

export type LogFunction = <T extends any[]>(...args: T) => T extends [...infer Rest, infer Last] ? Last : never
export const setLogColors = (_colors: InspectColors) => colors = _colors;

const EMPTY_OPTIONS: FormattedInspectOptions = {}
const formatArgs = (args: any[], options: FormattedInspectOptions = EMPTY_OPTIONS) =>
  isNode
    ? args.map(v => formattedInspect(v, { colors, ...options }))
    : args // in-browser console log is interactive - let it handle the formatting

export const log: LogFunction & {
  warn: LogFunction
  error: LogFunction
  unquoted: LogFunction
  json: LogFunction
} = (<T extends any[]>(...args: T): T extends [...infer Rest, infer Last] ? Last : never => {
  const last = args[args.length - 1]
  console.log(...formatArgs(args))
  return last
}) as LogFn

log.warn = <T extends any[]>(...args: T): T extends [...infer Rest, infer Last] ? Last : never => {
  const last = args[args.length - 1]
  console.warn(...formatArgs(args))
  return last
}

log.error = <T extends any[]>(...args: T): T extends [...infer Rest, infer Last] ? Last : never => {
  const last = args[args.length - 1]
  console.error(...formatArgs(args))
  return last
}

log.unquoted = <T extends any[]>(...args: T): T extends [...infer Rest, infer Last] ? Last : never => {
  const last = args[args.length - 1]
  console.log(...formatArgs(args, { unquoted: true }))
  return last
}

log.json = <T extends any[]>(...args: T): T extends [...infer Rest, infer Last] ? Last : never => {
  const last = args[args.length - 1]
  console.log(...formatArgs(args, { json: true }))
  return last
}