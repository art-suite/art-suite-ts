import type { JsonValue, JsonPrimitive, JsonObject, JsonArray } from "type-fest";
export { JsonValue, JsonPrimitive, JsonObject, JsonArray }
export interface ToJsonValue {
  toJsonValue: () => JsonValue;
}

export type JsonPropsObject = { [key: string]: JsonPrimitive } // JsonObject with all values as JsonPrimitive

export type NonNullJsonValue = Exclude<JsonValue, null>;
