import { JsonArray, JsonObject, JsonValue } from './JsonTypes'
import { isJsonString, isJsonObject, isJsonBoolean, isJsonArray } from './JsonTypeFunctions'

// validation functions that throw errors if the value is not valid; and return the value if it is valid

/** Validates and returns string if value is a JSON string. Throws error if not. */
export const validateJsonString = (value: JsonValue): string => {
  if (!isJsonString(value)) throw new Error('Expected a JSON string');
  return value;
}

/** Validates and returns number if value is a JSON number. Throws error if not. */
export const validateJsonNumber = (value: JsonValue): number => {
  if (typeof value !== 'number') throw new Error('Expected a JSON number');
  return value;
}

/** Validates and returns boolean if value is a JSON boolean. Throws error if not. */
export const validateJsonBoolean = (value: JsonValue): boolean => {
  if (typeof value !== 'boolean') throw new Error('Expected a JSON boolean');
  return value;
}

/** Validates and returns object if value is a JSON object. Throws error if not. */
export const validateJsonObject = (value: JsonValue): JsonObject => {
  if (!isJsonObject(value)) throw new Error('Expected a JSON object');
  return value;
}

/** Validates and returns array if value is a JSON array. Throws error if not. */
export const validateJsonArray = (value: JsonValue): JsonArray => {
  if (!isJsonArray(value)) throw new Error('Expected a JSON array');
  return value;
}

/** Validates and returns string if value is a JSON string or null/undefined. Throws error if not. */
export const validateOptionalJsonString = (value: JsonValue): string | undefined => value == null ? undefined : validateJsonString(value);

/** Validates and returns number if value is a JSON number or null/undefined. Throws error if not. */
export const validateOptionalJsonNumber = (value: JsonValue): number | undefined => value == null ? undefined : validateJsonNumber(value);

/** Validates and returns boolean if value is a JSON boolean or null/undefined. Throws error if not. */
export const validateOptionalJsonBoolean = (value: JsonValue): boolean | undefined => value == null ? undefined : validateJsonBoolean(value);

/** Validates and returns object if value is a JSON object or null/undefined. Throws error if not. */
export const validateOptionalJsonObject = (value: JsonValue): JsonObject | undefined => value == null ? undefined : validateJsonObject(value);

/** Validates and returns array if value is a JSON array or null/undefined. Throws error if not. */
export const validateOptionalJsonArray = (value: JsonValue): JsonArray | undefined => value == null ? undefined : validateJsonArray(value);
