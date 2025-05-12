// import { lowerCamelCase } from '../ArtStandardLib'
import { object } from '@art-suite/art-core-ts-comprehensions'
import { isPlainObject, isDate, isObject, isFunction } from '@art-suite/art-core-ts-types'
import { JsonObject, JsonValue, JsonScalerValue, JsonPropsObject } from './JsonTypes'
import { isJsonString, isJsonObject, isJsonBoolean, isJsonNumber, isJsonScalerValue, isJsonArray } from './JsonTypeFunctions'


/**
 * Converts a value to a JsonValue.
 *
 * Fully converts all values to JsonValues, recursively.
 *
 * If the value is an unknown type, it is converted to a string and returned as a JsonString.
 */
export const toJsonValue = (value: any, normalizeKeys: boolean = false): JsonValue => {
  if (isDate(value)) return value.toISOString();
  if (isJsonArray(value)) return value.map((v) => toJsonValue(v, normalizeKeys));
  if (isObject(value)) {
    if (isFunction(value.toJsonValue)) return value.toJsonValue();
    if (isJsonObject(value)) return toJsonObject(value, normalizeKeys);
  }
  if (isJsonString(value) || isJsonNumber(value) || isJsonBoolean(value)) return value;
  if (value == null) return null; //return null if null or undefined
  return `${value}`;
}

/**
 * Converts an object to a JsonObject. If the input is not an object, it returns an empty object.
 *
 * Fully converts all values to JsonValues, recursively.
 */
export const toJsonObject = (value: any, normalizeKeys: boolean = false): JsonObject =>
  isPlainObject(value)
    ? object(value, { with: (v: JsonValue) => toJsonValue(v, normalizeKeys), withKey: (v, k) => /*normalizeKeys ? lowerCamelCase(k) :*/ k })
    : {}

/**
 * Converts an object to a JsonObject. If the input is null or undefined, it returns null.
 *
 * Fully converts all values to JsonValues, recursively.
 */
export const toJsonObjectOrNull = (value: any, normalizeKeys: boolean = false): JsonObject | null =>
  value ? toJsonObject(value, normalizeKeys) : null
/**
 * Returns the value if it looks like a JSON object AND filters out all non-scaler values.
 * If it's not a JSON object, it returns an empty object.
 *
 * Either way, you get a plain object in response.
 */
export const toJsonPropsObject = (value: any): JsonPropsObject => {
  if (isJsonObject(value)) return object(value, { when: isJsonScalerValue, with: (v: JsonValue) => v as JsonScalerValue });
  return {};
}
