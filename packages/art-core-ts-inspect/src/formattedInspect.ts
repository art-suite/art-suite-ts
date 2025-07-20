import { isDate, isArray, isPlainObject } from '@art-suite/art-core-ts-types'
import { defaultColors, InspectColors } from './colors'
import { json } from 'stream/consumers'

const indent = (level: number) => '  '.repeat(level)

export type FormattedInspectOptions = {
  unquoted?: boolean,
  colors?: InspectColors,
  json?: boolean,
}

const formattedInspectObject = (obj: Record<string, unknown>, options: FormattedInspectOptions, level: number): string => {
  const { unquoted = false, colors = defaultColors, json = false } = options
  const keys = Object.keys(obj)
  if (!keys.length) return colors.symbol('{}')
  const lines = keys.map((key, index) => {
    const value = formattedInspect(obj[key], options, level + 1)
    return `${indent(level + 1)}${colors.propName(json ? JSON.stringify(key) : key)}: ${value}${!unquoted && index < keys.length - 1 ? ',' : ''}`
  })
  return [
    unquoted ? '' : colors.symbol('{'),
    ...lines,
    unquoted ? '' : `${indent(level)}${colors.symbol('}')}`
  ].join('\n').replace(/\n+$/, '')
}

const formattedInspectArray = (array: unknown[], options: FormattedInspectOptions, level: number): string => {
  const { unquoted = false, colors = defaultColors } = options
  if (!array.length) return colors.symbol('[]')
  const lines = array.map((item, index) => `${indent(level + 1)}${formattedInspect(item, options, level + 1)}${!unquoted && index < array.length - 1 ? ',' : ''}`)
  return [
    unquoted ? '' : colors.symbol('['),
    ...lines,
    unquoted ? '' : `${indent(level)}${colors.symbol(']')}`
  ].join('\n').replace(/\n+$/, '\n')
}

/**
 * Formats a value for inspection.
 * @param value - The value to format.
 * @param options - The options for the formatted inspect.
 * @param _level - The level of the value. (internal use only)
 *
 * @returns The formatted value.
 */
export const formattedInspect = (value: unknown, options: FormattedInspectOptions = {}, _level = 0): string => {
  const { unquoted = false, colors = defaultColors, json = false } = options
  try {
    if (value === null) return colors.nullOrUndefined('null')
    if (value === undefined) return colors.nullOrUndefined(json ? 'null' : 'undefined')
    if (typeof value === 'string') return colors.value(!json && (unquoted || _level === 0) ? value : JSON.stringify(value))
    if (typeof value === 'number' || typeof value === 'boolean') return colors.value(String(value))
    if (isDate(value)) return colors.value(
      unquoted ? value.toLocaleString() : json ? JSON.stringify(value.toISOString()) : value.toISOString()
    )
  } catch (error) {
    return colors.error(String(value))
  }
  if (isArray(value)) return formattedInspectArray(value, options, _level)
  if (isPlainObject(value)) return formattedInspectObject(value as Record<string, unknown>, options, _level)
  return colors.value(String(value))
}