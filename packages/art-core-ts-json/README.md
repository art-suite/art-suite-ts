# @art-suite/art-core-ts-json

Seamless, type-safe utilities for working with JSON in TypeScript.

## Why This Module?

Working with JSON in JavaScript and TypeScript is common, but the standard APIs lack type safety, ergonomic helpers, and robust conversion tools. Developers often need to validate, convert, and manipulate JSON data, but TypeScript's type system doesn't natively support JSON structures, and conversions between JSON and other JavaScript types can be tedious and error-prone.

- **TypeScript types for JSON:** Provides robust, reusable TypeScript types for JSON values, objects, arrays, and scalars.
- **Common tooling for TypeScript support:** Includes type guards and helpers for working with JSON data in a type-safe way.
- **Conversion utilities:** Makes it easy to convert between JSON and other JavaScript types, including recursive conversion and normalization.

## Example Installation and Use (Required)

Install with npm:

```sh
npm install @art-suite/art-core-ts-json
```

Basic usage:

```ts
import {
  JsonValue,
  JsonObject,
  isJsonObject,
  isJsonArray,
  toJsonValue,
  toJsonObject,
  toJsonPropsObject,
  asJsonObject,
  jsonToJs,
} from "@art-suite/art-core-ts-json";

// Type-safe checks
const value: unknown = { foo: "bar" };
if (isJsonObject(value)) {
  // value is now typed as JsonObject
}

// Convert any value to a valid JsonValue (recursively)
const json: JsonValue = toJsonValue(new Date());
// Convert to JsonObject (recursively)
const obj: JsonObject = toJsonObject({ foo: 1, bar: "baz" });
// Get only scalar properties
const props = toJsonPropsObject({ foo: 1, bar: "baz", nested: { a: 2 } });

// Fast, shallow type check
asJsonObject({ foo: 1 }); // returns { foo: 1 }
asJsonObject("not an object"); // returns {}

// Convert JSON back to JS/TS code string
jsonToJs({ foo: "bar", arr: [1, 2, 3] });
```

## Functional Overview

### TypeScript Types for JSON

- `JsonValue` — Any valid JSON value (object, array, string, number, boolean, or null)
- `JsonObject` — JSON object (`{ [key: string]: JsonValue }`)
- `JsonArray` — JSON array (`JsonValue[]`)
- `JsonScalerValue` — JSON scalar (string, number, boolean, or null)
- `JsonPropsObject` — JSON object with only scalar values

### Type Guards and Utilities

- `isJsonObject(value)` — Checks if a value is a JSON object
- `isJsonArray(value)` — Checks if a value is a JSON array
- `isJsonScalerValue(value)` — Checks if a value is a JSON scalar
- `isJsonString(value)` — Checks if a value is a JSON string
- `isJsonNumber(value)` — Checks if a value is a JSON number
- `isJsonBoolean(value)` — Checks if a value is a JSON boolean

### Conversion Utilities

- `toJsonValue(value, normalizeKeys?)` — Recursively converts any value to a valid `JsonValue`
- `toJsonObject(value, normalizeKeys?)` — Recursively converts any value to a valid `JsonObject`
- `toJsonObjectOrNull(value, normalizeKeys?)` — Like `toJsonObject`, but returns `null` for nullish input
- `toJsonPropsObject(value)` — Returns a JSON object with only scalar properties
- `asJsonObject(value)` — Fast, shallow type check for JSON objects

### JSON to JS/TS Code

- `jsonToJs(value)` — Converts a JSON value to a pretty-printed JS/TS code string

## API Documentation Reference

For detailed information on all exported functions and their parameters, please refer to the TypeScript typings and JSDoc comments within the source code.
