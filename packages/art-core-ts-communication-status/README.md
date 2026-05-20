# @art-suite/art-core-ts-communication-status

_When writing HTTP APIs, error handling doesn't need to be such a pain!_

## What This Package Is For

Any remote call — HTTP or otherwise — can fail in dozens of distinct ways: a wide range of HTTP status codes, network errors, timeouts, user cancellations, disabled features. But the client only has a handful of meaningful ways to *respond* to those failures. This package's job is to collapse the full space of possible outcomes into the small set of actions a client can actually take.

The status names are just labels; **the action category is the point**. Everything else is semantics for the programmer to debug.

### The Action Categories

| Status | What the client should do |
|---|---|
| `success` | Process the response |
| `pending` | Show progress; optionally allow cancel |
| `networkFailure`, `timeoutFailure` | **Retry with backoff** — transport-level problem (includes rate-limit, gateway timeouts, DNS/TCP failures). Always safe to auto-retry as long as you back off. |
| `serverFailure` | **Implementer decides** — server-side *logic* failure. The operation may or may not have completed. For reads or idempotent ops: retry with backoff. For non-idempotent writes: query the API to check what happened, or surface to the user. |
| `missing`, `clientFailure` | **Don't retry** — the request itself is wrong; fix it before trying again |
| `clientFailureNotAuthorized` | **Prompt the user** — auth is missing, expired, or denied; re-login or refresh token |
| `aborted` | **Don't retry** — the client deliberately cancelled; honor that |
| `disabled` | Request is intentionally turned off; re-enable to proceed |

Use the corresponding `is*` guards (`isRetryableFailure`, `isServerFailure`, `isClientFailure`, `isClientFailureNotAuthorized`, etc.) to drive client behavior off these categories directly, without ever inspecting the raw HTTP code.

### Why More Statuses Than Action Categories?

Strictly speaking, you only need a handful of action categories — yet this library exposes roughly 50% more statuses than that. The extra granularity exists so the client can **log, alert, and escalate** failures appropriately even when the *action* is identical.

For example, `missing` (e.g. 404) and `clientFailure` (e.g. 400) both fall under "don't retry — fix the request," but you almost certainly want to treat them differently in logs:

- `missing` is often expected — a user typed a bad URL, a record was deleted — and usually warrants an `info` log at most
- `clientFailure` typically means the *code* sent a malformed request, which is a bug worth `warn` or `error`
- `serverFailure` usually deserves louder alerting than `networkFailure` — one points at a server bug, the other at flaky transport
- `clientFailureNotAuthorized` may want its own metric for security/audit purposes, separate from generic client errors

Think of each status as **action category + severity hint**. Use the action category to decide what the code *does*; use the specific status to decide how loud to *be* about it.

## Why This Module?

HTTP status codes confound two distinct purposes: telling the client what to *do*, and conveying semantic detail about *why* something failed. That dual purpose makes client code more complex than it needs to be. And not every failure is even covered by HTTP — network failures, timeouts, and client-side aborts have no status code at all.

This library teases those concerns apart by focusing solely on what software can act on. The full space of HTTP status codes plus non-HTTP failure modes is reduced to a small set of actionable categories, so client-side code can be simpler, more robust, and safer (e.g. never retry-looping a rate-limited endpoint).

## Example Installation and Use (Required)

Install with npm:

```sh
npm install @art-suite/art-core-ts-communication-status
```

Basic usage:

```ts
import {
  isSuccess,
  isServerFailure,
  success, // === "success"
  missing, // === "missing"
} from "@art-suite/art-core-ts-communication-status";

// Handle success
if (isSuccess(status)) {...}

// Simply handle all server failures
if (isServerFailure(status)) {...}

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

Statuses are strings, or you can import constants with the identical name:

- **Success:**
  - `success` — hurray! (2xx)

- **Missing:**
  - `missing` — *resource* doesn't exist (3xx redirects, 404, 410). Note this is about *data*, not about request shape — see `clientFailure` for unsupported methods/capabilities.

- **Client-side Failures (fix the request or prompt the user):**
  - `clientFailure` — request is wrong (most 4xx, plus 501, 505)
  - `clientFailureNotAuthorized` — auth missing/expired/denied (401, 403, 407, 451, 511)

- **Server-side Logic Failure (idempotency matters):**
  - `serverFailure` — operation may or may not have completed (500, 506-508, 510, 525, 526, 530)

- **Transport-level Failures (always safe to retry with backoff):**
  - `networkFailure` — rate-limit, gateway down, DNS/TCP/TLS failure (423, 425, 429, 502, 503, 521, 523, 527, plus non-HTTP transport failures)
  - `timeoutFailure` — request exceeded a deadline (408, 504, 522, 524, 598, 599, plus client-side timeouts)

- **Liminal Statuses (not errors, not success):**
  - `aborted` — request was deliberately cancelled by the client
  - `pending` — request is in progress
  - `disabled` — request was intentionally turned off (httpStatus 0)

### Type Guards

- `isSuccess(status)` — succeeded
- `isMissing(status)` — resource doesn't exist
- `isClientFailure(status)` — request itself is wrong (includes auth failures)
- `isClientFailureNotAuthorized(status)` — specifically an auth failure
- `isServerFailure(status)` — server logic failure (idempotency matters)
- `isNetworkFailure(status)` — transport-level failure
- `isTimeout(status)` — timeout
- `isAborted(status)` — client cancelled
- `isPending(status)` — in progress
- `isDisabled(status)` — intentionally off
- `isFailure(status)` — any failure of any kind
- `isNonClientFailure(status)` — a failure that wasn't the client's fault
- `isRetryableFailure(status)` — **safe to auto-retry with backoff** (networkFailure + timeoutFailure only)

### HTTP Status Code Mapping

The library maps HTTP status codes to these simplified states. Notice how it does NOT respect HTTP's leading-digit grouping — that's the whole point: HTTP scatters transport problems, timeouts, and rate-limits across both the 4xx and 5xx ranges, so "treat all 5xx the same" leads to broken retry logic.

| HTTP codes | CommunicationStatus |
|---|---|
| `0` | `disabled` |
| `2xx` | `success` |
| `3xx`, `404`, `410` | `missing` |
| `401`, `403`, `407`, `451`, `511` | `clientFailureNotAuthorized` |
| `408`, `504`, `522`, `524`, `598`, `599` | `timeoutFailure` |
| `423`, `425`, `429`, `502`, `503`, `521`, `523`, `527` | `networkFailure` |
| `501`, `505`, and most other 4xx | `clientFailure` |
| `500`, `506`–`508`, `510`, `525`, `526`, `530`, and other 5xx | `serverFailure` |

Note: HTTP redirects (3xx) are protocol-level signals and should be handled (followed) by the HTTP client library. They're mapped to `missing` only as a defensive fallback if one ever reaches application code.

## API Documentation Reference

For detailed information on all exported functions and their parameters, please refer to the TypeScript typings and JSDoc comments within the source code.
