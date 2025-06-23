# @art-suite/art-core-ts-compare

Deep equality, inequality, less-than and greater-than comparison - complete with custom object support.

## Quick Start - Equality Functions

The easiest way to use this library is with the standard equality functions:

```ts
import { eq, neq, lt, gt, lte, gte } from "@art-suite/art-core-ts-compare";

// Basic equality
eq(5, 5); // true
eq([1, 2], [1, 2]); // true
eq({ a: 1 }, { a: 1 }); // true
eq(null, null); // true

// Inequality
neq(5, 10); // true
neq([1, 2], [1, 3]); // true
neq({ a: 1 }, { a: 2 }); // true

// Less than / Greater than
lt(5, 10); // true
lt("a", "z"); // true
lt([1, 2], [1, 2, 3]); // true
lt({ a: 1 }, { a: 1, b: 2 }); // true (missing key)

gt(10, 5); // true
gt("z", "a"); // true
gt([1, 2, 3], [1, 2]); // true

// Less than or equal / Greater than or equal
lte(5, 5); // true
lte(5, 10); // true
gte(10, 10); // true
gte(10, 5); // true

// Custom objects with comparison methods
class Box {
  constructor(public value: number) {}
  compare(other: any) {
    if (!(other instanceof Box)) return -1;
    return this.value - other.value;
  }
}

eq(new Box(5), new Box(5)); // true
lt(new Box(2), new Box(5)); // true
```

## Power User - Deep Compare Function

For advanced use cases, the `compare` function provides fine-grained control:

## Deep Compare Specification

This function performs a **deep comparison** between two JavaScript values and returns:

- A **negative number** if the left value is less than the right.
- A **positive number** if the left value is greater than the right.
- `0` if the values are considered equal.
- `NaN` if the values are not comparable (different types or incompatible comparisons).

### Scope

Primarily designed for comparing **JSON-style values**:

- `null`, booleans, numbers, strings
- Arrays
- Plain objects

It also supports **custom objects** that implement comparison interfaces.

### Custom Comparison Methods

If the **left operand** defines one of the following methods, it will be used in this priority order:

1. **`.compare(right: unknown): number`** (highest priority)
   Must return a negative number, zero, or a positive number. Used for sorting.

2. **`.lt(right: unknown): boolean` and `.gt(right: unknown): boolean`**
   Used only if `.compare` is not present. Returns `-1` if `a.lt(b)` is true, `1` if `a.gt(b)` is true, or `0` if neither is true.

3. **`.eq(right: unknown): boolean`** (lowest priority)
   Used only if `.compare` and inequality methods are not present. If `true`, returns `0`. If `false`, falls back to type-based comparison.

These methods may throw. The caller is responsible for handling errors.

### Comparison Rules

#### Primitive Types

- **Numbers**: Compared via subtraction (`a - b`) for efficiency.
- **Strings**: Compared via `String.prototype.localeCompare()` for proper locale-aware comparison.
- **Booleans**: Converted to numbers (`Number(a) - Number(b)`) for comparison.
- **`null`** is treated as less than any non-`null` value.
- **`undefined`** is treated as greater than `null` but less than any number or string.
- **`NaN`** is not equal to anything, including itself.

#### Arrays

Compared element by element:

- Compare each index recursively.
- First non-zero result is returned.
- If all elements are equal, shorter arrays sort first.

#### Plain Objects

- Keys are merged from both objects and sorted lexicographically.
- For each key in sorted order:
  - If a key is **missing in one object and present in the other**, the object missing the key is always considered less (comes first), regardless of the present value or key order.
  - If both objects have the key, their values are compared recursively.
- If all keys and values are equal, objects are equal.

**Examples:**

- `{a: 1}` vs `{a: 1, b: 2}` → first is less (missing `b`)
- `{a: 1, b: 0}` vs `{a: 1}` → second is less (missing `b`)
- `{}` vs `{a: undefined}` → first is less (missing `a`)
- `{a: null}` vs `{}` → second is less (missing `a`)
- `{x: 1}` vs `{y: 1}` → `{y: 1}` is less (missing `x`), so `compare({x: 1}, {y: 1})` returns `1`, `compare({y: 1}, {x: 1})` returns `-1`

#### Incompatible Comparisons

The function returns `NaN` when:

- **Different types**: Comparing values of different primitive types (e.g., number vs string, boolean vs number)
- **Incompatible objects**: Objects that are not `==` and don't implement custom comparison methods
- **Unsupported types**: Functions, symbols, classes, or other non-JSON-like values

**Note**: Arrays and plain objects are always comparable (element-by-element and key-by-key respectively), even if they contain incompatible values internally.

### Error Handling

This function **may throw** if:

- Custom `.compare` or `.eq` methods throw.
- Incompatible or uncoercible types are compared.

Consumers (e.g., equality wrappers) are expected to catch errors and treat them as inequality or failure to compare.

### TypeScript Usage Examples

```ts
deepCompare(5, 10); // -5 (using subtraction)
deepCompare("z", "a"); // 1 (using localeCompare)
deepCompare(null, 0); // -1
deepCompare([1, 2], [1, 2, 3]); // -1
deepCompare({ a: 1 }, { a: 1 }); // 0
deepCompare({ a: 1 }, { a: 2 }); // -1

deepCompare({ a: 1 }, { a: 1, b: 2 }); // -1 (missing b)
deepCompare({ a: 1, b: 0 }, { a: 1 }); // 1 (other is missing b)
deepCompare({}, { a: undefined }); // -1 (missing a)
deepCompare({ a: null }, {}); // 1 (other is missing a)
deepCompare({ x: 1 }, { y: 1 }); // 1 ({y: 1} is missing x)
deepCompare({ y: 1 }, { x: 1 }); // -1 ({y: 1} is missing x)

// Incompatible comparisons return NaN
deepCompare(5, "hello"); // NaN
deepCompare(true, 42); // NaN
deepCompare(() => {}, {}); // NaN

class Box {
  constructor(public value: number) {}
  compare(other: any) {
    if (!(other instanceof Box)) return -1;
    return this.value - other.value;
  }
}

deepCompare(new Box(2), new Box(5)); // -3

class Tag {
  constructor(public name: string) {}
  eq(other: any) {
    return other instanceof Tag && other.name === this.name;
  }
}

deepCompare(new Tag("a"), new Tag("a")); // 0
deepCompare(new Tag("a"), new Tag("b")); // fallback result (non-zero)

class Range {
  constructor(public start: number, public end: number) {}
  lt(other: any): boolean {
    return other instanceof Range && this.end < other.start;
  }
  gt(other: any): boolean {
    return other instanceof Range && this.start > other.end;
  }
}

deepCompare(new Range(1, 3), new Range(4, 6)); // -1 (1-3 < 4-6)
deepCompare(new Range(4, 6), new Range(1, 3)); // 1 (4-6 > 1-3)
deepCompare(new Range(1, 3), new Range(2, 4)); // 0 (overlapping ranges)
```

### Guarantees

- Returns a stable comparison result for all JSON-like structures.
- Respects `.compare()` and `.eq()` if defined on the **left operand**.
- Returns `NaN` for incompatible type comparisons.
- Never swallows internal errors — follows `localeCompare`-style strictness.
