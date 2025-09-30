import { isArray, isPlainObject, isFunction } from '@art-suite/art-core-ts-types'
import { objectKeyCount } from '@art-suite/art-core-ts-containers'

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

/**
 * Compares two plain objects. If the keys are different, the two key sets are sorted and compared as arrays of strings.
 * If the keys are the same, the values are compared recursively.
 * @param a - The first object to compare
 * @param b - The second object to compare
 * @returns A number indicating the comparison result
 */
const comparePlainObjects = (a: Record<string, any>, b: Record<string, any>): number => {
  // Create a merged list of all unique keys and sort it
  // const allKeys = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()

  // Compare values for keys in A that are also in B
  let differentKeys = false
  let leastDifferentKey: string | undefined
  let leastDifferentKeyResult: number = 0
  for (const key in a) {
    if (!(key in b)) differentKeys = true;
    else {
      // Both have the key, compare their values
      const result = compare(a[key], b[key])
      if (result !== 0) {
        if (!leastDifferentKey || leastDifferentKey > key) {
          leastDifferentKey = key
          leastDifferentKeyResult = result
        }
      }
    }
  }

  // if B had all As keys, we need to check if B has any keys that A doesn't have
  if (!differentKeys) {
    for (const key in b) {
      if (!(key in a)) { differentKeys = true; break }
    }
  }

  // if the keys are different, compare the keys
  if (differentKeys) {
    return compareArrays(Object.keys(a), Object.keys(b))
  }

  return leastDifferentKeyResult // All keys and values are equal
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

/**
 * deep structural comparison
 *
 * @param a - The first value to compare
 * @param b - The second value to compare
 * @returns A number indicating the comparison result:
 *   - **< 0**: `a` is less than `b`
 *   - **== 0**: `a` is equal to `b` (deep structural equality)
 *   - **> 0**: `a` is greater than `b`
 *   - **NaN**: Values cannot be compared (incompatible types or custom comparison failed)
 *
 * For more details on comparison behavior, see the art-core-ts-compare README.
 */
export const compare = (a: any, b: any): number => {
  if (a === b) return 0;
  // Handle custom comparable first
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