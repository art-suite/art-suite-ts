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
const formatArgs = (args: any[], options: FormattedInspectOptions = EMPTY_OPTIONS) => args.map(v => formattedInspect(v, { colors, ...options }))

export const log: LogFunction & {
  warn: LogFunction
  error: LogFunction
  unquoted: LogFunction
  json: LogFunction
} = (<T extends any[]>(...args: T): T extends [...infer Rest, infer Last] ? Last : never => {
  const last = args[args.length - 1]
  console.log(formatArgs(args).join(' '))
  return last
}) as LogFn

log.warn = <T extends any[]>(...args: T): T extends [...infer Rest, infer Last] ? Last : never => {
  const last = args[args.length - 1]
  console.warn(formatArgs(args).join(' '))
  return last
}

log.error = <T extends any[]>(...args: T): T extends [...infer Rest, infer Last] ? Last : never => {
  const last = args[args.length - 1]
  console.error(formatArgs(args).join(' '))
  return last
}

log.unquoted = <T extends any[]>(...args: T): T extends [...infer Rest, infer Last] ? Last : never => {
  const last = args[args.length - 1]
  console.log(formatArgs(args, { unquoted: true }).join(' '))
  return last
}

log.json = <T extends any[]>(...args: T): T extends [...infer Rest, infer Last] ? Last : never => {
  const last = args[args.length - 1]
  console.log(formatArgs(args, { json: true }).join(' '))
  return last
}