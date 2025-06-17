import type { JsonPrimitive } from "type-fest";

// not using type-fest's JsonValue because it causes "Type instantiation is excessively deep and possibly infinite."
// errors too often, and this simpler version still fully expresses the type of a JSON value.
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
type JsonArray = JsonValue[];
type JsonObject = { [key: string]: JsonValue };

export { JsonValue, JsonPrimitive, JsonObject, JsonArray }
export interface ToJsonValue {
  toJsonValue: () => JsonValue;
}

export type JsonPropsObject = { [key: string]: JsonPrimitive } // JsonObject with all values as JsonPrimitive

export type NonNullJsonValue = Exclude<JsonValue, null>;
