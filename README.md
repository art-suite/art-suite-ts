# Art Suite TS Monorepo

> The Standard Library that ought to exist for JavaScript/TypeScript.

JavaScript/TypeScript is missing a lot of fundamental, consistent tooling that other languages take for granted. This monorepo contains the core libraries that provide these essential tools:

## Core Libraries

- [art-core-ts-types](./packages/art-core-ts-types) - Runtime typing: consistent way to identify types at runtime
- [art-core-ts-containers](./packages/art-core-ts-containers) - Containers and iteration
  - Full comprehensions support (powerfully create new containers from other containers)
  - Common container tools: merge, compact, flatten, compactFlatten...
- [art-core-ts-json](./packages/art-core-ts-json) - JSON tooling and TypeScript types
- [art-core-ts-string-case](./packages/art-core-ts-string-case) - String case conversion with proper acronym handling
- [art-core-ts-time](./packages/art-core-ts-time) - Time and Date utilities
  - Convert between string, integer and Date representations of dates seamlessly
  - Time presenters: format-date, "time ago", "time duration"
- [art-core-ts-comprehensions](./packages/art-core-ts-comprehensions) - Unified interface for working with arrays, objects, and other iterables

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
