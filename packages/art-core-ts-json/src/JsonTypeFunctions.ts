import { JsonObject, JsonArray, JsonPrimitive, JsonValue } from './JsonTypes'

export const isJsonPrimitive = (value: any): value is JsonPrimitive =>
  typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null;

// Note, isJsonArray is shallow; it doesn't guarantee the elements are JsonValues
export const isJsonObject = (value: any): value is JsonObject =>
  typeof value === "object" && !Array.isArray(value) && value !== null;

// Note, isJsonArray is shallow; it doesn't guarantee the elements are JsonValues
export const isJsonArray = (value: any): value is JsonArray =>
  Array.isArray(value);

export const isJsonString = (value: any): value is string =>
  typeof value === 'string';

export const isJsonNumber = (value: any): value is number =>
  typeof value === 'number';

export const isJsonBoolean = (value: any): value is boolean =>
  typeof value === 'boolean';

export const isJsonValue = (value: any): value is JsonValue =>
  isJsonPrimitive(value) || isJsonObject(value) || isJsonArray(value);

export const isJsonValueDeep = (value: any): value is JsonValue =>
  isJsonObject(value) ? Object.values(value).every(isJsonValueDeep)
    : isJsonArray(value) ? value.every(isJsonValueDeep)
      : isJsonPrimitive(value);
