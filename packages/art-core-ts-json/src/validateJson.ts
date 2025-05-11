import { JsonObject, JsonValue } from './JsonTypes'
import { isJsonString, isJsonObject, isJsonBoolean } from './JsonTypeTests'

export const validateJsonString = (value: JsonValue) => {
  if (!isJsonString(value)) throw new Error('Expected a JSON string');
  return value;
}

export const validateJsonObjectOrAbsent = (value: JsonValue) => value == null ? value : validateJsonObject(value);
export const validateJsonObject = (value: JsonValue): JsonObject => {
  if (!isJsonObject(value)) throw new Error('Expected a JSON object');
  return value;
}

export const validateJsonStringOrAbsent = (value: JsonValue) => value == null ? value : validateJsonString(value);

export const validateJsonStringArrayOrAbsent = (value: JsonValue): string[] | undefined =>
  Array.isArray(value) && value.every(isJsonString) ? value : undefined;

export const validateJsonBoolean = (value: JsonValue) => {
  if (!isJsonBoolean(value)) throw new Error('Expected a JSON boolean');
  return value;
}

export const validateJsonBooleanOrAbsent = (value: JsonValue) => value == null ? value : validateJsonBoolean(value);

export const validateJsonNumber = (value: JsonValue) => {
  if (typeof value !== 'number') throw new Error('Expected a JSON number');
  return value;
}

export const validateJsonNumberOrAbsent = (value: JsonValue) => value == null ? value : validateJsonNumber(value);
