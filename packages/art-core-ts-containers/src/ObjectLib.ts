import { compactFlatten } from './CompactFlatten'
import { PlainObject } from '@art-suite/art-core-ts-types'
import { Simplify } from 'type-fest'

export const objectHasKeys = (obj: Record<string, any>): boolean => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return true
    }
  }
  return false
}

export const objectKeyCount = (obj: Record<string, any> | null | undefined): number => {
  if (!obj) return 0
  let count = 0
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      count++
    }
  }
  return count
}


type ObjectWithoutFunction = <T extends PlainObject, K extends string[]>(
  obj: T,
  ...keys: [...K]
) => Simplify<Omit<T, K[number]>>;
/**
 * Removes the specified keys from an object. If keys were removed, returns a fresh object, otherwise returns the original object.
 * @param obj - The object to remove keys from
 * @param properties - The keys to remove
 * @returns A new object with the specified keys removed
 */
export const objectWithout: ObjectWithoutFunction = <T extends PlainObject, K extends string[]>(obj: T | null | undefined, ...properties: [...K]): Simplify<Omit<T, K[number]>> => {
  if (!obj) return {} as Omit<T, K[number]>
  const propsToRemove = compactFlatten(properties) as K[]

  let found = false
  for (const key of propsToRemove) {
    if (Object.prototype.hasOwnProperty.call(obj, key as any)) {
      found = true
      break
    }
  }

  // fast path, no keys to remove
  if (!found) return obj as Omit<T, K[number]>

  const result: Record<string, any> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && !propsToRemove.includes(key as any))
      result[key] = obj[key]
  }

  return result as Simplify<Omit<T, K[number]>>
}