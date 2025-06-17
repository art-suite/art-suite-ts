import { JsonObject, JsonPropsObject, JsonValue, JsonPrimitive } from './JsonTypes'
import { isJsonObject } from './JsonTypeFunctions'
import { object } from '@art-suite/art-core-ts-comprehensions'
import { isJsonPrimitive, } from './JsonTypeFunctions'

/**
 * Returns the value if it looks like a JSON object (does not check any property values) otherwise returns an empty object.
 *
 * Called "asJsonObject" to indicate O(1) time complexity. It's mostly just a fast type-check.
 *
 * Either way, you get a plain object in response.
 */
export const asJsonObject = (value: any): JsonObject => {
  if (isJsonObject(value)) return value;
  return {};
}

export const asJsonPropsObject = (value: any): JsonPropsObject => {
  if (isJsonObject(value)) return object(value, { when: isJsonPrimitive, with: (v: JsonValue) => v as JsonPrimitive });
  return {};
}
