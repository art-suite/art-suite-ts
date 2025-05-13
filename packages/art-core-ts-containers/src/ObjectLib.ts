import { compactFlatten } from './CompactFlatten'
import { Simplify } from 'type-fest'

export const objectHasKeys = (obj: Record<string, any>): boolean => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return true
    }
  }
  return false
}

export const objectKeyCount = (obj: Record<string, any>): number => {
  let count = 0
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      count++
    }
  }
  return count
}


/*
  objectWithout: (obj, properties...) ->
    return {} unless obj
    properties = compactFlatten properties

    if find prop in properties with obj.hasOwnProperty prop
      object v, prop from obj when !(prop in properties)

    else
      obj

*/
export const objectWithout = <T extends Record<string, any>, K extends keyof T>(obj: T | null | undefined, ...properties: K[]): Simplify<Omit<T, K>> => {
  if (!obj) return {} as Omit<T, K>
  const propsToRemove = compactFlatten(properties) as K[]

  let found = false
  for (const key of propsToRemove) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      found = true
      break
    }
  }

  if (!found) return obj as Omit<T, K>

  const result = {} as Omit<T, K>
  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      !propsToRemove.includes(key as unknown as K)
    ) {
      const typedKey = key as unknown as Exclude<keyof T, K>
      result[typedKey] = obj[typedKey]
    }
  }

  return result
}