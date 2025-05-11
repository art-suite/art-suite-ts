import { JsonObject, JsonArray, JsonValue, JsonScalerValue } from './JsonTypes'

// Note, isJsonObject is shallow; it doesn't guarantee the elements are JsonValues
export function isJsonObject(value: any): value is JsonObject {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}

// Note, isJsonArray is shallow; it doesn't guarantee the elements are JsonValues
export function isJsonArray(value: JsonValue | undefined | null): value is JsonArray {
  return Array.isArray(value);
}

export function isJsonScalerValue(value: JsonValue | undefined | null): value is JsonScalerValue {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null;
}

export function isJsonString(value: JsonValue | undefined | null): value is string {
  return typeof value === 'string';
}

export function isJsonNumber(value: JsonValue | undefined | null): value is number {
  return typeof value === 'number';
}

export function isJsonBoolean(value: JsonValue | undefined | null): value is boolean {
  return typeof value === 'boolean';
}
