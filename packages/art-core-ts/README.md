# @art-suite/art-core-ts

The standard library JavaScript should have had. This package provides a comprehensive set of utilities that make JavaScript/TypeScript development more productive and enjoyable.

With tree-shaking support, only the portions of art-core that you actually use will be included in your bundle, keeping your application lean and efficient.

## Component Libraries

This package combines several specialized libraries, each focusing on a specific aspect of development:

- [@art-suite/art-core-ts-types](https://npmjs.com/@art-suite/art-core-ts-types) - JavaScript's type system is famously inconsistent at runtime. This library unifies and standardizes type checks by providing a set of highly-performant, well-tested `isFoo` functions, abstracting away JavaScript's quirks.

- [@art-suite/art-core-ts-containers](https://npmjs.com/@art-suite/art-core-ts-containers) - Essential, high-performance utilities for working with arrays and plain objects. Provides robust, pure-functional implementations of common operations like `merge`, array flattening, and efficient object key operations that are missing or inefficient in native JavaScript.

- [@art-suite/art-core-ts-json](https://npmjs.com/@art-suite/art-core-ts-json) - Seamless, type-safe utilities for working with JSON in TypeScript. Provides robust TypeScript types for JSON values, type guards, and conversion utilities that make it easy to work with JSON data in a type-safe way.

- [@art-suite/art-core-ts-string-case](https://npmjs.com/@art-suite/art-core-ts-string-case) - Effortless, lossless conversion between all common string case formats in programming. Handles edge cases (especially acronyms) correctly and enables round-trip conversion between all supported formats without losing word boundaries or acronym information.

- [@art-suite/art-core-ts-time](https://npmjs.com/@art-suite/art-core-ts-time) - Seamless, simple utilities for working with dates, times, and durations. Provides a unified set of utilities for effortless conversion between standard date/time representations, easy formatting, and common calculations like "start of day" or "first of month".

- [@art-suite/art-core-ts-comprehensions](https://npmjs.com/@art-suite/art-core-ts-comprehensions) - A powerful and flexible comprehension library that provides a unified interface for working with arrays, objects, and other iterables. Each comprehension function can accept any input container as the source and returns the appropriate type (object, array, or found value).

## Installation

```bash
npm install @art-suite/art-core-ts
```

## Usage

```typescript
import /* your needed utilities */ "@art-suite/art-core-ts";
```

## License

MIT
