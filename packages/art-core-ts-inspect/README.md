# @art-suite/art-core-ts-inspect

Easy, powerful tools for inspecting data at runtime to accelerate development.

## Why This Module?

Runtime data inspection is essential for accelerating development, but standard logging approaches often require code rewriting and produce output that's hard to read or reuse. Developers need functional logging that integrates seamlessly into expressions, clean inspection of complex object hierarchies, and output that can be copy-pasted for use elsewhere.

- **Functional logging:** The `log` function returns the last value passed in, so it can be used inline inside expressions without breaking code flow
- **Clean object inspection:** Beautiful, readable output for complex object hierarchies that makes understanding runtime data at a glance much easier
- **Copy-paste friendly:** Logged output is legal JavaScript that can be directly used elsewhere
- **Multiple output formats:** Standard, unquoted, and formatted inspection options for different use cases

## Example Installation and Use (Required)

Install with npm:

```sh
npm install @art-suite/art-core-ts-inspect
```

Basic usage:

```ts
import { log, formattedInspect } from "@art-suite/art-core-ts-inspect";

// Functional logging - returns the last value
const result = log("Processing user:", user); // logs and returns user
const processed = processUser(log("Input:", user)); // logs inline, continues processing

// Multiple arguments
log("User ID:", userId, "Profile:", profile); // logs all, returns profile

// Different log levels
log.warn("Warning:", warningMessage); // returns warningMessage
log.error("Error occurred:", error); // returns error

// Unquoted output for cleaner object inspection
log.unquoted("User object:", user); // cleaner, more readable output

// Formatted inspection for complex objects
const formatted = formattedInspect(complexObject);
console.log(formatted);
```

## Functional Overview

### Core Logging Functions

- `log(...args)` — Logs all arguments and returns the last one
- `log.warn(...args)` — Logs with console.warn and returns the last argument
- `log.error(...args)` — Logs with console.error and returns the last argument
- `log.unquoted(...args)` — Logs with cleaner, unquoted output and returns the last argument

### Inspection Utilities

- `formattedInspect(value)` — Returns a formatted string representation of any value

### TypeScript Types

- `LogFunction` — Type for the functional logging interface

## Key Features

### Functional Programming Style

The logging functions are designed for functional programming patterns, allowing you to inspect data without breaking expression chains:

```ts
// Instead of:
const user = getUser();
console.log("User:", user);
const processed = processUser(user);

// You can do:
const processed = processUser(log("User:", getUser()));
```

### Inline Expression Logging

The `log` function returns the last value passed to it, making it perfect for inline debugging:

```ts
const a = 123;
const b = 345;
return a + log("this is b", b);
// Output: "this is b 345"
// Returns: 468 (123 + 345)
```

This allows you to add logging without restructuring your code or creating temporary variables.

### Clean Object Inspection

The `log.unquoted` function provides cleaner output for complex objects:

```ts
const user = {
  id: 123,
  name: "John Doe",
  preferences: {
    theme: "dark",
    notifications: true,
  },
};

log.unquoted("User:", user);
// Output is clean, readable, and copy-paste friendly
```

### Copy-Paste Friendly Output

Standard logging output is valid JavaScript that can be directly copied and used:

```ts
const data = { foo: "bar", nested: { value: 42 } };
log("Data:", data);
// Output can be copied and pasted directly into code
```

### Human-Readable Inspection

The `log.unquoted` function removes symbol noise to make output more human-readable, perfect for production code where you want precise but friendly output:

```ts
const user = {
  id: 123,
  name: "John Doe",
  preferences: {
    theme: "dark",
    notifications: true,
  },
};

log.unquoted("User:", user);
// Clean, human-friendly output without excessive quotes and symbols
```

### Color Logging Support

All logging functions support color output for enhanced readability:

- Standard `log()` uses colors for better visual distinction
- `log.unquoted()` provides colored, clean output
- Colors are automatically detected and used in terminal environments

## API Documentation Reference

For detailed information on all exported functions and their parameters, please refer to the TypeScript typings and JSDoc comments within the source code.
