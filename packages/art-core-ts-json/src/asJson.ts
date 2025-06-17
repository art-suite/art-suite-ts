import { JsonObject, JsonValue } from './JsonTypes'
import { isJsonObject } from './JsonTypeFunctions'

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
