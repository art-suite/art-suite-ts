# Art Suite TS Monorepo

> The Standard Library that ought to exist for JavaScript/TypeScript.

JavaScript/TypeScript is missing a lot of fundamental, consistent tooling that other languages take for granted. This monorepo contains the core libraries that provide these essential tools:

## Core Libraries

- [art-core-ts-types](./packages/art-core-ts-types) - Runtime typing: consistent `isFoo` functions for reliable type identification at runtime
- [art-core-ts-containers](./packages/art-core-ts-containers) - Containers and iteration
  - Common container tools: merge, compact, flatten, compactFlatten...
  - Fast key-existence and key-count checks for plain objects
- [art-core-ts-comprehensions](./packages/art-core-ts-comprehensions) - Unified comprehensions for arrays, objects, and any Iterable
  - One API across data structures, with sync and async variants
  - Function name picks the return type: `object`, `array`, `find`, `reduce`, `each`
- [art-core-ts-compare](./packages/art-core-ts-compare) - Deep equality and ordering: `eq`, `neq`, `lt`, `gt`, `lte`, `gte` with custom-object support
- [art-core-ts-json](./packages/art-core-ts-json) - JSON tooling and TypeScript types, with type guards and conversion helpers
- [art-core-ts-string-case](./packages/art-core-ts-string-case) - Lossless conversion between camelCase, PascalCase, snake_case, dash-case, etc., with proper acronym handling
- [art-core-ts-string-lib](./packages/art-core-ts-string-lib) - String utilities: `commaize` for thousands separators and ergonomic `pluralize`
- [art-core-ts-time](./packages/art-core-ts-time) - Time and Date utilities
  - Convert between string, integer and Date representations of dates seamlessly
  - Treats numbers below `1e11` as seconds, above as milliseconds — interchangeable
  - Time presenters: format-date, "time ago", "time duration"
- [art-core-ts-async](./packages/art-core-ts-async) - Promise-based async helpers: `timeout` (delay) and `timeoutAt` (resolve at a specific time)
- [art-core-ts-math](./packages/art-core-ts-math) - Floating-point comparison: `float32Eq`, `float64Eq`, and matching `lt`/`gt`/`lte`/`gte` plus zero-tolerance helpers
- [art-core-ts-inspect](./packages/art-core-ts-inspect) - Runtime data inspection: functional `log` (returns its argument) and `formattedInspect` for clean, copy-pasteable output
- [art-core-ts-communication-status](./packages/art-core-ts-communication-status) - 9 human-readable statuses for client-server APIs, covering 4 cases HTTP doesn't

## Convenience Package

- [art-core-ts](./packages/art-core-ts) - A single package that imports all the above libraries. With tree-shaking support, only the portions you actually use will be included in your bundle.

## Development

### Prerequisites

- Node.js (v22 or higher)
- npm (v10 or higher)

### Setup

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test
```

### Project Structure

Each package in the `packages/` directory is a standalone npm package that can be used independently. They are designed to work together seamlessly but can be used separately to minimize bundle size.

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
