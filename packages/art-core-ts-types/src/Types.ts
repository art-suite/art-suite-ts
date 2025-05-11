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

export const isPlainObject = (v: any): v is Record<string, any> => v != null && null == Object.getPrototypeOf(Object.getPrototypeOf(v))

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
export const isNull = (value: any): boolean => value == null
export const isNotNull = (value: any): boolean => !isNull(value)
export const isNullish = (value: any): boolean => value == null || value == undefined
export const isNotNullish = (value: any): boolean => !isNullish(value)

/**
 * present - simply non-null, non-undefined, and non-empty-string OR object can implement a custom getPresent() or present() method
 * @param v
 * @returns
 */
export const present = (v: any): boolean => {
  if (v == null) return false
  if (isFunction(v.getPresent)) {
    return v.getPresent()
  } else if (isFunction(v.present)) {
    return v.present()
  } else if (isString(v)) {
    return stringIsPresent(v)
  } else return true
}
