import { JsonObject, JsonArray, JsonValue } from './JsonTypes'
import { isJsonString, isJsonObject, isJsonPrimitive, isJsonArray } from '../coverage/JsonTypeFunctions'
import { objectHasKeys } from '@art-suite/art-core-ts-containers'
import { array } from '@art-suite/art-core-ts-comprehensions'

const INDENT_STR = '  ';

export const jsonObjectToJs = (json: JsonObject, indent = ''): string => {
  if (!objectHasKeys(json)) return '{}';
  const subIndent = indent + INDENT_STR;
  return `{\n${subIndent}${array(json, (value: JsonValue, key: string) => `${/^[a-z][a-z0-9_]*$/i.test(key) ? key : JSON.stringify(key)}: ${jsonToJs(value, subIndent)}`)
    .join(`,\n${subIndent}`)}\n${indent}}`;
};

export const jsonArrayToJs = (json: JsonArray, indent = ''): string => {
  if (json.length === 0) return '[]';
  const subIndent = indent + INDENT_STR;
  return `[\n${subIndent}${json.map(v => jsonToJs(v, subIndent)).join(`,\n${subIndent}`)
    }\n${indent}]`;
};

export const jsonToJs = (value: JsonValue, indent = ''): string => {
  if (isJsonString(value)) return JSON.stringify(value);
  if (isJsonPrimitive(value)) return String(value);
  if (isJsonArray(value)) return jsonArrayToJs(value, indent);
  if (isJsonObject(value)) return jsonObjectToJs(value, indent);
  return JSON.stringify(String(value));
}
