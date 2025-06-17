# @art-suite/art-core-ts-async

Essential async utilities for TypeScript, including robust timeout helpers for Promises.

## Why This Module?

It makes common async operations more succinct, clearer, and less error-prone—while providing modern, Promise-based alternatives to legacy APIs like `setTimeout`. This module helps you write more readable and maintainable async code with a simple, type-safe API.

- **timeout:** Create a Promise that resolves after a specified delay, optionally running a function after the timeout.
- **timeoutAt:** Create a Promise that resolves at a specific time (Date, timestamp, or date string), optionally running a function after the timeout.

## Example Installation and Use (Required)

Install with npm:

```sh
npm install @art-suite/art-core-ts-async
```

Basic usage:

```ts
import { timeout, timeoutAt } from "@art-suite/art-core-ts-async";

// Wait for 500ms
await timeout(500);

// Wait for 1 second, then run a function
await timeout(1000, () => console.log("done"));

// Wait until a specific time (e.g., 2 seconds from now)
await timeoutAt(Date.now() + 2000);

// Wait until a specific time, then run a function
await timeoutAt(new Date(Date.now() + 1000), () => "finished"); // resolves to "finished"
```

## Functional Overview

### `timeout(ms: number, f?: () => unknown): Promise<unknown>`

Creates a Promise that resolves after a specified number of milliseconds. Optionally, a function can be provided to be called after the timeout. If so, the Promise will resolve with the result of the function.

- `timeout(1000)` → resolves after 1 second
- `timeout(500, () => "done")` → resolves after 500ms with value `"done"`

### `timeoutAt(triggerAtTime: AllDateTypes, f?: () => unknown): Promise<unknown>`

Creates a Promise that resolves at a specific time. The time can be a Date, a number (seconds or milliseconds), or a date-time string. Optionally, a function can be provided to be called after the timeout. If so, the Promise will resolve with the result of the function.

- `timeoutAt(Date.now() + 1000)` → resolves after 1 second
- `timeoutAt(new Date(Date.now() + 500), () => 42)` → resolves after 500ms with value `42`

## API Documentation Reference

For detailed information on all exported functions and their parameters, please refer to the TypeScript typings and JSDoc comments within the source code.
