import { PlainObject } from "./TypeScriptTypes"

type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array

/*

  @isPromise: (obj) => obj? && isFunction(obj.then) && !isFunction obj
  @isRegExp: (obj) => obj.constructor.name == "RegExp"
  @isNumber: isNumber = (obj) => typeof obj == "number"

  isNonNegativeInt: (x) ->
    ((x | 0) == x) &&
     x >= 0

  @isError:                   (obj) => obj? && obj instanceof Error
  @isDate:                    (obj) => obj?.constructor == Date
  @isString: isString =       (obj) => typeof obj == "string"
  @isFunction: isFunction =   (obj) => typeof obj == "function"
  @isEmptyObject:             (obj) => Object.keys(obj).length == 0
  @isBoolean:                 (obj) => obj == true || obj == false

  @isArrayBuffer: isArrayBuffer = if global.ArrayBuffer
      (obj) -> obj? && obj.constructor == ArrayBuffer
    else -> false
  @isTypedArray: (obj) -> obj? && obj.length >= 0 &&  obj.length == (obj.length | 0) && isArrayBuffer obj.buffer

  */

/**
 * Returns true if the value is an object. (note, Arrays are objects)
 * This is only false for null, undefined, functions, and primitives like strings, numbers, and booleans.
 * @param v
 * @returns
 */
export const isObject = (v: any): v is Record<string, any> => v != null && typeof v === 'object'

/**
 * Returns true if the value is a plain object - i.e. an object who's prototype is Object
 * @param v
 * @returns
 */
export const isPlainObject = (v: any): v is PlainObject => {
  if (!isObject(v)) return false
  if (v.constructor === Object) return true // fast pass, but could fail if v was created in a different context with a different instance of Object
  const prototype = Object.getPrototypeOf(v)
  if (prototype === null) return true
  return null == Object.getPrototypeOf(prototype)
}

export const asPlainObject = (v: any): PlainObject => isPlainObject(v) ? v : {}

export const isFunction = (obj: any): obj is Function => typeof obj === "function"
export const isNumber = (obj: any): obj is number => typeof obj === "number"
export const isString = (obj: any): obj is string => typeof obj === "string"
export const isArrayBuffer = (obj: any): obj is ArrayBuffer => obj != null && obj.constructor === ArrayBuffer
export const isArray = (obj: any): obj is any[] => Array.isArray(obj)

export const isPromise = (obj: any): obj is Promise<any> => obj != null && isFunction(obj.then) && !isFunction(obj)
export const isRegExp = (obj: any): obj is RegExp => obj?.constructor.name === "RegExp"
export const isError = (obj: any): obj is Error => obj != null && obj instanceof Error
export const isDate = (obj: any): obj is Date => obj?.constructor === Date
export const isEmptyObject = (obj: any): obj is Record<string, never> => Object.keys(obj).length === 0
export const isBoolean = (obj: any): obj is boolean => obj === true || obj === false
export const isTypedArray = (obj: any): obj is TypedArray =>
  obj != null &&
  obj.length >= 0 &&
  obj.length === (obj.length | 0) &&
  isArrayBuffer(obj.buffer)

export const isNonNegativeInt = (x: number): x is number => ((x | 0) === x) && x >= 0

export const stringIsPresent = (str: string): boolean => isString(str) && !/^(\s+|)$/.test(str)

export const exists = (value: any): boolean => value != null
export const doesNotExist = (value: any): boolean => !exists(value)

export const isNull = (value: any): boolean => value === null
export const isNotNull = (value: any): boolean => !isNull(value)

export const isUndefined = (value: any): boolean => value === undefined
export const isNotUndefined = (value: any): boolean => !isUndefined(value)

export const isNullish = (value: any): boolean => value == null || value == undefined
export const isNotNullish = (value: any): boolean => !isNullish(value)

/**
 * present - simply non-null, non-undefined, and non-empty-string OR object can implement a custom getPresent() or present() method
 * @param v
 * @returns
 */
export const present = <T>(v: T): v is NonNullable<T> => {
  if (v == null) return false
  if (isFunction((v as any).getPresent)) {
    return (v as any).getPresent()
  } else if (isFunction((v as any).present)) {
    return (v as any).present()
  } else if (isString(v)) {
    return stringIsPresent(v)
  } else return true
}
