# @art-suite/art-core-ts-comprehensions

A powerful and flexible comprehension library for JavaScript that provides a unified interface for working with arrays, objects, and other iterables. It offers a consistent way to perform common operations like mapping, filtering, and reducing across different data structures.

The biggest difference between this library and other comprehensions is each comprehension function can accept any input container as the source: objects, arrays or anything that is Iterable. The name of the comprehension function indicates the return type:

- `object` returns an object
- `array` returns an array
- `find` returns the found value
- `reduce` returns the reduced value
- `each` returns the `returning` value or undefined

## Features

- Unified interface for working with arrays, objects, and other iterables
- Consistent behavior across different data structures
- Support for both synchronous and asynchronous operations
- Type-safe operations with TypeScript support
- Efficient implementations that maintain the original data structure's characteristics

## Installation

```bash
npm install @art-suite/art-core-ts-comprehensions
```

## API Overview

### Core Functions

All comprehension functions take 0, 1, or 2 arguments:

- **arg 1**: the container to iterate over
- **arg 2**: withFunction or Options object

- **`each(source, withOrOptions?)`**: Iterates over a source, executing the withFunction for each item. Returns the `returning` value if provided, otherwise `undefined`.
- **`array(source, withOrOptions?)`**: Creates a new array by applying the withFunction to each item in the source.
- **`object(source, withOrOptions?)`**: Creates a new object by applying the withFunction to each item in the source.
- **`reduce(source, withOrOptions?)`**: Reduces the source to a single value using the withFunction.
- **`find(source, withOrOptions?)`**: Returns the first item in the source that satisfies the withFunction.

## Deep Comprehensions

The `DeepComprehensions` module provides advanced utilities for mapping and iterating over deeply nested arrays and objects. These functions are especially useful when you need to process data structures with arbitrary nesting.

> **Note:** These functions can now be imported directly from the package:
>
> ```javascript
> import {
>   map,
>   deepEach,
>   deepMap,
> } from "@art-suite/art-core-ts-comprehensions";
> ```

### Exports

- **`map(source, withOrOptions?)`**: Shallowly maps over an array or object, returning a new container of the same type with mapped values. Does not recurse into nested containers.
- **`deepEach(source, withOrOptions?)`**: Iterates over all values in a deeply nested array or object structure, calling the withFunction for each non-container value. Supports an optional `when` filter.
- **`deepMap(source, withOrOptions?)`**: Recursively maps over all values in a deeply nested array or object, returning a new structure with the same shape but with mapped values. Supports an optional `when` filter.

### Usage Examples

```javascript
import { deepMap, deepEach, map } from "@art-suite/art-core-ts-comprehensions";

const nested = {
  a: 1,
  b: 2,
  c: [1, 2, 3],
};

// Deeply map all values, incrementing each by 1
const incremented = deepMap(nested, (value) => value + 1);
// Result: { a: 2, b: 3, c: [2, 3, 4] }

// Deeply map, but only for keys not equal to 'c'
const filtered = deepMap(nested, {
  with: (value) => value + 1,
  when: (value, key) => key !== "c",
});
// Result: { a: 2, b: 3 }

// Deeply iterate and sum all values
let sum = 0;
deepEach(nested, (value) => (sum += value));
// sum === 9

// Shallow map (does not recurse into arrays/objects)
const shallow = map(nested, (value) => value + 10);
// Result: { a: 11, b: 12, c: "1,2,310" } // Note: [1,2,3] + 10 coerces to string
```

## Usage Examples

### Basic Array Operations

```javascript
import { array, each, find } from "@art-suite/art-core-ts-comprehensions";

const numbers = [1, 2, 3, 4, 5];

// Map operation
const doubled = array(numbers, (x) => x * 2);
// Result: [2, 4, 6, 8, 10]

// Filter and transform
const evenDoubled = array(numbers, {
  with: (x) => x * 2,
  when: (x) => x % 2 === 0,
});
// Result: [4, 8]

// ForEach operation
each(numbers, (x) => console.log(x));
// Logs each number

// Find operation with when option
const firstEven = find(numbers, { when: (x) => x % 2 === 0 });
// Result: 2

// Find and transform
const firstEvenDoubled = find(numbers, {
  when: (x) => x % 2 === 0,
  with: (x) => x * 2,
});
// Result: 4
```

### Object Operations

```javascript
import { object, each } from "@art-suite/art-core-ts-comprehensions";

const data = {
  a: 1,
  b: 2,
  c: 3,
};

// Transform object values
const doubled = object(data, (value, key) => value * 2);
// Result: { a: 2, b: 4, c: 6 }

// Transform keys with withKey option
const keyTransformed = object(data, { withKey: (value) => value * 11 });
// Result: { 11: 1, 22: 2, 33: 3 }

// Iterate over object
each(data, (value, key) => console.log(`${key}: ${value}`));
// Logs each key-value pair

// Each with returning value
const result = each(data, {
  returning: "done",
  with: (value, key) => console.log(`${key}: ${value}`),
});
// Logs each key-value pair, result === "done"
```

### Reduce Operations

```javascript
import { reduce } from "@art-suite/art-core-ts-comprehensions";

const numbers = [1, 2, 3, 4, 5];

// Sum all numbers (uses first element as initial value)
const sum = reduce(numbers, (acc, x) => acc + x);
// Result: 15

// Sum with inject option
const sumWithInitial = reduce(numbers, {
  with: (acc, x) => acc + x,
  inject: 10,
});
// Result: 25

// Multiply with inject option
const product = reduce(numbers, {
  with: (acc, x) => acc * x,
  inject: 1,
});
// Result: 120

// Filter and reduce
const evenSum = reduce(numbers, {
  with: (acc, x) => acc + x,
  when: (x) => x % 2 === 0,
});
// Result: 6 (sum of even numbers only)

// Reduce with inject
reduce([1, 2, 3], { with: (acc, x) => acc + x, inject: 10 });
// Result: 16

// Each with returning
const result = each([1, 2, 3], {
  returning: "done",
  with: (x) => console.log(x),
});
// Result: "done"
```

### Working with Different Data Structures

```javascript
import { array, object } from "@art-suite/art-core-ts-comprehensions";

// Array-like object
const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };
const result1 = array(arrayLike, (x) => x.toUpperCase());
// Result: ['A', 'B', 'C']

// Set
const set = new Set([1, 2, 3]);
const result2 = array(set, (x) => x * 2);
// Result: [2, 4, 6]

// Map
const map = new Map([
  ["a", 1],
  ["b", 2],
]);
const result3 = object(map, (value, key) => value * 2);
// Result: { a: 2, b: 4 }

// Stop iteration early with stopWhen
const result4 = array([1, 2, 3, 4], {
  with: (x) => x * 2,
  stopWhen: (x) => x === 3,
});
// Result: [2, 4] (stops when value equals 3)

// Use into option to append to existing array
const existingArray = [100, 200];
const result5 = array([1, 2, 3], { with: (x) => x * 10, into: existingArray });
// Result: [100, 200, 10, 20, 30]

// Use into option to merge into existing object
const existingObject = { x: 999 };
const result6 = object([1, 2, 3], {
  with: (x) => x * 10,
  into: existingObject,
});
// Result: { x: 999, 1: 10, 2: 20, 3: 30 }
```

## Options Reference

All comprehension functions accept an options object as the second parameter. Here's a complete reference of all available options and which functions support them:

### Common Options (All Functions)

These options are supported by all comprehension functions:

- **`with`**: Function to transform each value

  - **Signature**: `(value, key) => transformedValue` (for `array`, `object`, `find`, `each`)
  - **Signature**: `(accumulator, value, key) => newAccumulator` (for `reduce`)
  - **Default**: If not provided, returns the original value unchanged
  - **Used by**: `array`, `object`, `reduce`, `find`, `each`

- **`when`**: Function to filter elements (predicate)

  - **Signature**: `(value, key) => boolean`
  - **Behavior**: Only processes elements where this returns `true`
  - **Used by**: `array`, `object`, `reduce`, `find`, `each`

- **`stopWhen`**: Function to stop iteration early
  - **Signature**: `(value, key) => boolean`
  - **Behavior**: Stops iteration when this returns `true`
  - **Used by**: `array`, `object`, `each`

### Function-Specific Options

#### `array(source, withOrOptions?)`

- **`into`**: Array to push results into
  - **Type**: `Array`
  - **Default**: Creates a new array
  - **Behavior**: Results are pushed into this array instead of creating a new one

#### `object(source, withOrOptions?)`

- **`into`**: Object to assign results into
  - **Type**: `Object`
  - **Default**: Creates a new object
  - **Behavior**: Results are assigned to this object instead of creating a new one
- **`withKey`**: Function to determine output keys
  - **Signature**: `(value, key) => newKey`
  - **Default**: Uses original keys (for objects) or values (for arrays/iterables)
  - **Behavior**: The returned value becomes the key in the output object

#### `reduce(source, withOrOptions?)`

- **`inject`**: Initial value for the reduction
  - **Type**: Any value
  - **Default**: Uses the first element as initial value
  - **Behavior**: This value becomes the starting accumulator

#### `each(source, withOrOptions?)`

- **`returning`**: Value to return
  - **Type**: Any value
  - **Default**: `undefined`
  - **Behavior**: This value is returned (not modified by `each` itself)

#### `find(source, withOrOptions?)`

- No function-specific options beyond the common ones

### Option Combinations and Behavior

- **`with` + `when`**: Transform only filtered elements
- **`with` + `stopWhen`**: Transform until stopping condition is met
- **`when` + `stopWhen`**: Filter until stopping condition is met
- **`with` + `when` + `stopWhen`**: Transform filtered elements until stopping condition is met

### Examples of Option Usage

```javascript
// Basic with function
array([1, 2, 3], { with: (x) => x * 2 });
// Result: [2, 4, 6]

// Filter with when
array([1, 2, 3, 4], { when: (x) => x % 2 === 0 });
// Result: [2, 4]

// Transform and filter
array([1, 2, 3, 4], { with: (x) => x * 2, when: (x) => x % 2 === 0 });
// Result: [4, 8]

// Stop early
array([1, 2, 3, 4], { with: (x) => x * 2, stopWhen: (x) => x === 3 });
// Result: [2, 4]

// Use into option
const existing = [100];
array([1, 2, 3], { with: (x) => x * 10, into: existing });
// Result: [100, 10, 20, 30]

// Object with custom keys
object([1, 2, 3], { withKey: (x) => `key_${x}`, with: (x) => x * 10 });
// Result: { key_1: 10, key_2: 20, key_3: 30 }

// Reduce with inject
reduce([1, 2, 3], { with: (acc, x) => acc + x, inject: 10 });
// Result: 16

// Each with returning
const result = each([1, 2, 3], {
  returning: "done",
  with: (x) => console.log(x),
});
// Result: "done"
```

## Key Concepts

### Source Types

The library works with various source types:

- Arrays
- Objects
- Sets
- Maps
- Array-like objects
- Any object with a `forEach` method
- Any object with a `map` method
- Any object with a `reduce` method

### With Functions

Each operation accepts a withFunction that receives:

- The current value
- The current key/index
- The source object
- The current iteration index

**Note**: For `reduce`, the withFunction signature is `(accumulator, value, key)` instead of `(value, key)`.

### Return Values

- `each`: Returns the `returning` value if provided, otherwise `undefined`
- `array`: Returns a new array
- `object`: Returns a new object
- `reduce`: Returns the accumulated value
- `find`: Returns the first matching item or undefined

## Supported Container Types

This library distinguishes between containers you can **iterate over** and containers you can **generate**:

### Containers You Can Iterate Over

You can use comprehension functions (like `each`, `reduce`, `find`, etc. as well as `object` and `array`) to iterate over any of the following:

- Arrays
- Objects
- Sets
- Maps
- Array-like objects (objects with a `length` property and indexed elements)
- Any object that implements the iterable protocol (has a `[Symbol.iterator]` method)

### Containers You Can Generate

Currently, only **arrays** and **plain objects** can be generated as output containers by the comprehension functions (such as `array`, `object`, `deepMap`, etc.).

> **Note:** Support for generating Maps and Sets may be added in the future.

This means that while you can iterate over many different types of containers, when you use a function that returns a new container (like `array`, `object`, or `deepMap`), the result will always be a new array or a new plain object, depending on the function used and the input type.

## License

MIT
