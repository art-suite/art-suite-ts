/**
 * DeepComprehensions is a library that provides a way to map and iterate over deeply nested comprehension iterables.
 *
 * It is useful for cases where you need to map or iterate over a deeply nested comprehension iterable.
 *
 * NOTE: due to their nature, deep comprehensions don't support TypeScript's type inference. You'll need to post-validate or coerce the results to the correct type.
 *
 * TODO: add Map and Set support.
 * TODO: add {when} support. Example usage: deepStripNull = deepMap(obj, {when: v => v !== null})
 */
import { isPlainObject } from '@art-suite/art-core-ts-types'
import { each, isComprehensionIterable, isFullySupportedComprehensionIterable, isArrayIterable, array, object } from './Comprehensions'
import { AnyContainer, FullySupportedContainer, ArrayInput, ObjectInput, NotPresent } from './ComprehensionTypes'
import { isFunction } from '@art-suite/art-core-ts-types'

export type DeepWithFunction = (value: any, key: any) => void
export type DeepWhenFunction = (value: any, key: any) => boolean

export type DeepOptions = {
  when?: DeepWhenFunction
  with?: DeepWithFunction
}

export type DeepSecondParameter = DeepWithFunction | DeepOptions

//******************************************************************************************************************
// HELPERS
//******************************************************************************************************************

const defaultWithFunction: DeepWithFunction = v => v
const defaultWhenFunction: DeepWhenFunction = () => true

type DeepOptionsFullSupport = {
  when: DeepWhenFunction
  with: DeepWithFunction
}

const normalizeDeepOptions = (options: DeepSecondParameter): DeepOptionsFullSupport => {
  if (isFunction(options)) {
    return { with: options, when: defaultWhenFunction }
  }
  return { with: options.with || defaultWithFunction, when: options.when || defaultWhenFunction }
}

const deepEachR = (obj: AnyContainer<any>, options: DeepOptionsFullSupport) => {
  each(obj, {
    when: options.when,
    with: (value: any, key: any) => {
      if (isComprehensionIterable(value)) {
        deepEachR(value, options)
      } else {
        if (options.when(value, key)) {
          options.with(value, key)
        }
      }
    }
  })
}

const deepMapR = (obj: AnyContainer<any>, options: DeepOptionsFullSupport) => {
  return mapInternal(obj, {
    when: options.when, with: (value: any, key: any) => {
      if (isFullySupportedComprehensionIterable(value)) {
        return deepMapR(value, options)
      }
      return options.with(value, key)
    }
  })
}

const mapInternal = (source: ArrayInput<any> | ObjectInput<any> | NotPresent, options: DeepOptionsFullSupport) => {
  if (isArrayIterable(source)) return array(source, options)
  if (isPlainObject(source)) return object(source, options)
  throw new Error(`Unsupported source type: ${typeof source}`)
}

//******************************************************************************************************************
// EXPORTS
//******************************************************************************************************************
/**
 * Maps over a fully supported comprehension iterable, shallowly.
 *
 * Returns the same container type (array or object) as the original object, but with the values mapped.
 *
 * @param source - The source to map over.
 * @param options - the map-function or {with: the map-function, when: the when-function}
 * @returns The mapped container.
 */
export const map = (source: ArrayInput<any> | ObjectInput<any> | NotPresent, options: DeepSecondParameter) =>
  mapInternal(source, normalizeDeepOptions(options))

/**
 * Iterates over a fully supported comprehension iterable, and any nested isComprehensionIterable values.
 *
 * withFunction is called for each value that is NOT isComprehensionIterable and true for whenFunction (if provided).
 *
 * whenFunction is called on EVERY value, isComprehensionIterable or not. If it returns false, isComprehensionIterable values will be skipped.
 *
 * @param obj - The object to iterate over.
 * @param options - the with-function or {with: the with-function, when: the when-function}
 * @returns The object.
 */
export const deepEach = (obj: AnyContainer<any>, options: DeepSecondParameter) =>
  deepEachR(obj, normalizeDeepOptions(options))

/**
 * Maps over a fully supported comprehension iterable, and any nested fully supported comprehension iterables.
 *
 * Returns the same structure (of fully supported comprehension iterables) as the original object, but with the values mapped.
 * If the source is not a fully supported comprehension iterable, it will return the source unchanged.
 * If the source is a fully supported comprehension iterable, it will return a new fully supported comprehension iterable with the values mapped.
 *
 * whenFunction is called on EVERY value, isComprehensionIterable or not. If it returns false, isComprehensionIterable values will be skipped.
 *
 * @param obj - The object to map over.
 * @param options - the map-function or {with: the map-function, when: the when-function}
 * @returns The mapped object.
 */
export const deepMap = (obj: FullySupportedContainer<any>, options: DeepSecondParameter) =>
  deepMapR(obj, normalizeDeepOptions(options))
