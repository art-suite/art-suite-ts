import { isArray, isPlainObject, isFunction } from '@art-suite/art-core-ts-types'

export interface CustomComparableInterface {

  /**
   * Compares `this` with `b`
   * @param b - The value to compare `this` with
   * @returns A number greater than zero if `this` is greater than `b`, less than zero if `this` is less than `b`, and zero if `this` is equal to `b`
   */
  compare(b: any): number
}

export interface CustomEqualityInterface {
  /**
   * Checks if `this` equals `b`
   * @param b - The value to compare `this` with
   * @returns true if equal, false otherwise
   */
  eq(b: any): boolean
}

export interface CustomInequalityInterface extends CustomEqualityInterface {
  /**
   * Checks if `this` is not equal to `b`
   * @param b - The value to compare `this` with
   * @returns true if not equal, false otherwise
   */
  lt(b: any): boolean
  gt(b: any): boolean
  lte(b: any): boolean
  gte(b: any): boolean
}

const compareArrays = (a: any[], b: any[]): number => {
  const minLength = Math.min(a.length, b.length)

  for (let i = 0; i < minLength; i++) {
    const result = compare(a[i], b[i])
    if (result !== 0) return result
  }

  return a.length - b.length
}

const comparePlainObjects = (a: Record<string, any>, b: Record<string, any>): number => {
  // Create a merged list of all unique keys and sort it
  const allKeys = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()

  // Iterate through the sorted keys to find the first non-zero comparison result
  for (const key of allKeys) {
    const aHas = key in a
    const bHas = key in b
    if (!aHas && bHas) return -1 // a is missing the key, so a is less
    if (aHas && !bHas) return 1  // b is missing the key, so b is less
    // Both have the key, compare their values
    const result = compare(a[key], b[key])
    if (result !== 0) return result
  }

  return 0 // All keys and values are equal
}

const compareCustomComparableHelper = (a: any, b: any): number => {
  // Only check for custom methods if a is not null/undefined and is an object
  if (a !== null && a !== undefined && typeof a === 'object') {
    // Check if left operand supports any of the custom methods (highest priority)
    if (isFunction(a.compare)) return a.compare(b);
    if (isFunction(a.eq) && a?.eq(b)) return 0;
    if (isFunction(a.lt) && a?.lt(b)) return -1;
    if (isFunction(a.gt) && a?.gt(b)) return 1;
    if (isFunction(a.lte) && a?.lte(b)) return -1;
    if (isFunction(a.gte) && a?.gte(b)) return 1;
  }
  return NaN
}

const compareCustomComparable = (a: any, b: any): number => {
  const customResult = compareCustomComparableHelper(a, b)
  if (!Number.isNaN(customResult)) return customResult
  return -compareCustomComparableHelper(b, a)
}

const comparePrimitives = (a: any, b: any): number => {
  // Handle null
  if (a === null && b === null) return 0
  if (a === null) return -1
  if (b === null) return 1

  // Handle undefined
  if (a === undefined && b === undefined) return 0
  if (a === undefined) return 1
  if (b === undefined) return -1

  // Handle NaN
  if (Number.isNaN(a) && Number.isNaN(b)) return 0
  if (Number.isNaN(a)) return -1
  if (Number.isNaN(b)) return 1

  // Handle numbers - use subtraction for efficiency
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }

  // Handle strings - use localeCompare for proper string comparison
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b)
  }

  // Handle booleans - convert to numbers for comparison
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return Number(a) - Number(b)
  }

  // Return NaN for different types or incompatible comparisons
  if (typeof a !== typeof b) return NaN

  // For same types that aren't numbers, strings, or booleans, return NaN
  return NaN
}

export const compare = (a: any, b: any): number => {
  // Handle custom comparables first
  const customResult = compareCustomComparable(a, b)
  if (!Number.isNaN(customResult)) return customResult

  // Handle arrays
  if (isArray(a) && isArray(b)) {
    return compareArrays(a, b)
  }

  // Handle plain objects
  if (isPlainObject(a) && isPlainObject(b)) {
    return comparePlainObjects(a, b)
  }

  // Handle primitives
  return comparePrimitives(a, b)
}