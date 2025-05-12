# @art-suite/art-core-ts-types

A simple, consistent library for runtime identification of JavaScript types.

## Why This Module?

**The Why:**
JavaScript's type system is famously inconsistent at runtime. Developers often struggle with the many different, sometimes unreliable, ways to check if a value is a string, array, date, or other type—leading to bugs, confusion, and duplicated code.

**The How:**
This library unifies and standardizes type checks by providing a set of highly-performant, well-tested `isFoo` functions. Each function implements the most reliable and efficient strategy for identifying its respective type, abstracting away JavaScript's quirks.

**The What:**
A comprehensive set of `isFoo` functions (like `isString`, `isDate`, `isPlainObject`, etc.) for robust, readable, and consistent runtime type checking.

## Example Installation and Use (Required)

Install with npm:

```sh
npm install @art-suite/art-core-ts-types
```

Basic usage:

```ts
import {
  isString,
  isPlainObject,
  isDate,
  isNull,
  isNotNull,
  isNullish,
  isNotNullish,
  exists,
  present,
} from "@art-suite/art-core-ts-types";

isString("hello"); // true
isPlainObject({ a: 1 }); // true
isDate(new Date()); // true
isDate("2020-01-01"); // false
isNull(null); // true
isNotNull(undefined); // false
isNullish(undefined); // true
isNotNullish(0); // true
exists(0); // true
present(""); // false
present("something"); // true
```

## Functional Overview

### Type Checking Functions

- **Primitives:**

  - `isString(value)` — Checks for string values.
  - `isNumber(value)` — Checks for numbers.
  - `isBoolean(value)` — Checks for booleans.
  - `isFunction(value)` — Checks for functions.

- **Objects and Collections:**

  - `isObject(value)` — Checks for any object (excluding null, primitives, and functions).
  - `isPlainObject(value)` — Checks for plain objects (i.e., `{}`).
  - `isArray(value)` — Checks for arrays.
  - `isArrayBuffer(value)` — Checks for ArrayBuffer instances.
  - `isTypedArray(value)` — Checks for any TypedArray.

- **Special Types:**

  - `isDate(value)` — Checks for Date objects.
  - `isRegExp(value)` — Checks for regular expressions.
  - `isError(value)` — Checks for Error objects.
  - `isPromise(value)` — Checks for Promise-like objects.

- **Other Utilities:**

  - `isEmptyObject(value)` — Checks if an object has no own properties.
  - `isNonNegativeInt(value)` — Checks for non-negative integers.
  - `stringIsPresent(value)` — Checks for non-empty, non-whitespace strings.

- **Null/Undefined/Exists Utilities:**
  - `isNull(value)` — Checks for `null` or `undefined` values.
  - `isNotNull(value)` — Checks for values that are not `null` or `undefined`.
  - `isNullish(value)` — Checks for `null` or `undefined` (alias for `isNull`).
  - `isNotNullish(value)` — Checks for values that are not `null` or `undefined` (alias for `isNotNull`).
  - `exists(value)` — Checks for non-null, non-undefined values.
  - `present(value)` — Checks for values that are present (non-null, non-undefined, non-empty string, or custom present-ness).

## API Documentation Reference

For detailed information on all exported functions and their parameters, please refer to the TypeScript typings and JSDoc comments within the source code.
