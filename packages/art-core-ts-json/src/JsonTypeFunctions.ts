import { JsonObject, JsonArray, JsonValue, JsonScalerValue } from './JsonTypes'

// Note, isJsonObject is shallow; it doesn't guarantee the elements are JsonValues
export const isJsonObject = (value: any): value is JsonObject =>
  typeof value === "object" && !Array.isArray(value) && value !== null;

// Note, isJsonArray is shallow; it doesn't guarantee the elements are JsonValues
export const isJsonArray = (value: JsonValue | undefined | null): value is JsonArray => Array.isArray(value);

export const isJsonScalerValue = (value: JsonValue | undefined | null): value is JsonScalerValue =>
  isJsonString(value) || isJsonNumber(value) || isJsonBoolean(value) || value === null;

export const isJsonString = (value: JsonValue | undefined | null): value is string => typeof value === 'string';
export const isJsonNumber = (value: JsonValue | undefined | null): value is number => typeof value === 'number';
export const isJsonBoolean = (value: JsonValue | undefined | null): value is boolean => typeof value === 'boolean';

