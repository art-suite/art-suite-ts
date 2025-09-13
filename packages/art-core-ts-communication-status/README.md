# @art-suite/art-core-ts-communication-status

_When writing HTTP clients, especially for APIs, error handling doesn't need to be such a pain!_ 

A simple, consistent library for simplifying communication status in client-server applications.

## Why This Module?

HTTP status codes confound two distinct purposes: providing machine-actionable status codes and conveying semantic information about errors to humans. This dual purpose leads to complexity and confusion in client-side code that needs to handle different types of failures appropriately.

Further, not all errors are captured by the HTTP status codes - i.e. network failures.

This library teases apart these concerns by focusing solely on what software can act on. It reduces the complex space of HTTP status codes and other communication states into a small set of actionable categories that make client-side code simpler and more robust.

A comprehensive set of status types (simple enumerated strings e.g. "success") that cover all possible machine-actionable communication states, including situations HTTP status codes don't address (like network failures and aborted requests).

## Example Installation and Use (Required)

Install with npm:

```sh
npm install @art-suite/art-core-ts-communication-status
```

Basic usage:

```ts
import {
  success,
  serverFailure,
  clientFailure,
  clientFailureNotAuthorized,
  missing,
  networkFailure,
  aborted,
  pending,
  isSuccess,
  isServerFailure,
  isClientFailure,
  isClientFailureNotAuthorized,
  isMissing,
  isNetworkFailure,
  isAborted,
  isPending,
} from "@art-suite/art-core-ts-communication-status";

// Handle success
if (isSuccess(status)) {
}

// Simply handle all server failures
if (isServerFailure(status)) {
  // Handle server failure
}

// or Handle multiple statues as a simple switch:
switch (status) {
  case success:
    /*...*/ break; // Request completed successfully
  case missing:
    /*...*/ break; // Resource not found, ask the user to fix
  default:
    /*...*/ break; // handle all other failures as one
}
```

## Functional Overview

### Status Types

Status are strings, or you can import constants with the identical name referencing the strings:

- **Success Status:**

  - `success` — hurray! (2xx)

- **Missing Status:**

  - `missing` — _resource not available_ (404, 501)

- **Client-side Failures:**

  - `clientFailure` — _client bug_ (4xx except 404, 505, 530)
  - `clientFailureNotAuthorized` — _bad auth_ (401, 403, 407, 451, 511)

- **Server-side Failures:**

  - `serverFailure` — _server/infra bug_ (5xx other than 501, 505, 511, 530)

- **Non HTTP Failure States:**
  - `networkFailure` — Network connectivity issues
  - `aborted` — Request was cancelled
  - `pending` — Request is in progress
  - `timeoutFailure` - Request timed out

### Type Guards

- `isSuccess(status)` — Checks if status indicates success
- `isMissing(status)` — Checks if status indicates missing resource
- `isClientFailure(status)` — Checks if status indicates client failure
- `isClientFailureNotAuthorized(status)` — Checks if status indicates auth failure
- `isServerFailure(status)` — Checks if status indicates server failure
- `isNetworkFailure(status)` — Checks if status indicates network issues
- `isAborted(status)` — Checks if status indicates aborted request
- `isPending(status)` — Checks if status indicates pending request

### HTTP Status Code Mapping

The library handles mapping HTTP status codes to these simplified states:

- 2xx → `success`
- 404, 501 → `missing`
- 401, 403, 407, 451, 511 → `clientFailureNotAuthorized`
- 4xx, 505, 530 → `clientFailure`
- 5xx → `serverFailure`

Note: HTTP redirects (3xx) are considered protocol-level signals and should be handled by the HTTP client library, not exposed to application code.

## API Documentation Reference

For detailed information on all exported functions and their parameters, please refer to the TypeScript typings and JSDoc comments within the source code.
