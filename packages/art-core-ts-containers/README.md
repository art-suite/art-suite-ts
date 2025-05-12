# @art-core-ts-containers

Essential, high-performance utilities for working with arrays and plain objects in JavaScript and TypeScript.

## Why This Module?

Working with arrays and plain objects has become much easier in modern JavaScript thanks to object structuring, destructuring, and the spread (`...`) operator. However, some core capabilities are still missing or inefficient in native JavaScript. The most important are:

- A robust, pure-functional, and optimized implementation of `merge` that handles `null` and `undefined` values distinctly to maximize utility
- Efficient utilities for flattening and compacting arrays.
- The fastest possible way to check if an object has any keys or to count its keys (since `Object.keys(obj).length` is slow).

## Example Installation and Use (Required)

Install with npm:

```sh
npm install @art-core-ts-containers
```

Basic usage:

```ts
import {
  merge,
  compactFlatten,
  objectHasKeys,
  objectKeyCount,
  deepStripNulls,
  deepStripNullish,
  stripNulls,
  stripNullish,
} from "@art-core-ts-containers";

// Merge objects: later objects take priority, null deletes, undefined is ignored/stripped
merge({ a: 1, b: 2, c: 3 }, { b: null, c: undefined, d: 4 }); // { a: 1, b: null, d: 4 }

// Flatten and compact arrays (removes null/undefined, flattens nested arrays)
compactFlatten([1, null, [2, undefined, [3, 4]], 5]); // [1, 2, 3, 4, 5]

// Efficient object key checks
objectHasKeys({}); // false
objectHasKeys({ a: 1 }); // true
objectKeyCount({ a: 1, b: 2 }); // 2

const data = { a: 1, b: null, c: { d: null, e: 2 } };
const arrayData = [1, 2, null, undefined, { b: null }];

deepStripNulls(data); // { a: 1, c: { e: 2 } }
deepStripNullish(arrayData); // [1, 2, {}]
stripNulls(arrayData); // [1, 2, undefined, {b: null}]
stripNullish(data); // { a: 1, c: { d: null, e: 2 } }
```

## Functional Overview

### Object Merging

- `merge(...objects)` — Merges a list of objects. Later objects in the list take priority.
  - **Null values**: Replace existing values (use `null` to "delete" a value).
  - **Undefined values**: Are ignored and stripped (do not overwrite or appear in the result).

> Merge is NOT functionally optimized

### Array Utilities

- `compactFlatten(array)` — Recursively flattens nested arrays and removes all `null`/`undefined` values.
- `compact(array)` — Removes all `null`/`undefined` values from a (possibly nested) array.
- `flatten(array)` — Recursively flattens nested arrays into a single array.

> These functions are Functionally Optimized (see below)

### Object Key Utilities

- `objectHasKeys(obj)` — Returns `true` if the object has at least one own property, `false` otherwise. (Faster than `Object.keys(obj).length > 0`)
- `objectKeyCount(obj)` — Returns the number of own properties on the object. (Faster than `Object.keys(obj).length`)

### Null Stripping Utilities

- `deepStripNulls(data)` — Recursively strips `null` from all properties of an object and elements of an array/tuple. Preserves types of primitives, functions, Dates, RegExps.
- `deepStripNullish(data)` — Recursively strips `null` and `undefined` from all properties of an object and elements of an array/tuple. Preserves types of primitives, functions, Dates, RegExps.
- `stripNulls(data)` — Shallowly strips `null` from all properties of an object and elements of an array/tuple. Does not recurse into nested objects or arrays.
- `stripNullish(data)` — Shallowly strips `null` and `undefined` from all properties of an object and elements of an array/tuple. Does not recurse into nested objects or arrays.

> Null(ish) stripping is NOT functionally optimized

## API Documentation Reference

For detailed information on all exported functions and their parameters, please refer to the TypeScript typings and JSDoc comments within the source code.

## Functionally Optimized (Work In Progress)

Not all functions are not yet functionally optimized:

- **Functionally Optimized**: If the returned value would be structurally identical to the passed-in value, the passed-in value should be returned without creating any new objects or arrays. This is more efficient and also allows for a quick check to see if there was any change.

The goal is to make all these functions work like this, but for right now only the compact, flatten and compactFlatten functions work this way.
