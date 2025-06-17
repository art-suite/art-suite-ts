import { deepEach, deepMap } from '@art-suite/art-core-ts-comprehensions'
import { PlainObject, isPromise } from '@art-suite/art-core-ts-types'

export type DeeplyStripPromises<T> = T extends PromiseLike<infer U>
  ? DeeplyStripPromises<U> // recursively stripping promises
  : T extends (infer U)[]
  ? DeeplyStripPromises<U>[] // handle arrays
  : T extends PlainObject
  ? { [K in keyof T]: DeeplyStripPromises<T[K]> } // handle objects
  : T; // handle non-arrays and non-objects

/**
 * deepAll resolves all promises in a nested object/array structure
 *
 * Important: this assumes the passed-in data is not mutated by the time it is returned
 * @param obj - The object/array to resolve promises in
 * @returns The object/array with all promises resolved
 * @example
 * const obj = {
 *   a: 1,
 *   b: Promise.resolve(2),
 *   c: [Promise.resolve(3), Promise.resolve(4)],
 * }
 * const result = await deepAll(obj)
 * console.log(result) // { a: 1, b: 2, c: [3, 4] }
 */
export const deepAll = async <T>(obj: T): Promise<DeeplyStripPromises<T>> => {
  const promises: Promise<any>[] = []
  deepEach(obj as any, async (value) => {
    if (isPromise(value)) promises.push(value)
  })
  let i = 0
  const resolved = await Promise.all(promises)
  return deepMap(obj as any, (value) =>
    isPromise(value) ? resolved[i++] : value
  ) as DeeplyStripPromises<T>
}
