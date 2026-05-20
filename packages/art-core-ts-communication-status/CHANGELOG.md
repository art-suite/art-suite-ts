# Changelog

All notable changes to `@art-suite/art-core-ts-communication-status` are documented here. Format roughly follows [Keep a Changelog](https://keepachangelog.com/).

## 0.12.0

The library's framing was sharpened around its actual purpose: collapsing the full space of remote-communication outcomes into the small set of *actions* a client can take. Several HTTP code mappings were corrected so they match the action category they actually belong to, and `serverFailure` was re-scoped to mean "logic failure where idempotency matters" rather than a generic 5xx bucket.

### Changed — behavior shifts callers should know about

- **`501 Not Implemented`** now maps to `clientFailure` (was `missing`). 501 is a request-capability problem — the server doesn't support the method/feature you asked for — not a missing data resource. Only the developer can resolve it.
- **`530` (Cloudflare wraps origin error)** now maps to `serverFailure` (was `clientFailure`). The origin is failing, not the client's request.
- **`serverFailure` semantics tightened.** It now strictly means "server-side logic failure; the operation may or may not have completed; idempotency matters." `502`, `503`, `504` no longer map to `serverFailure` — they're transport-level (see below). If you were treating `serverFailure` as "any 5xx," update logic that depends on it.
- **`aborted` is no longer considered retryable** by `isRetryableFailure`. Auto-retrying after a deliberate cancellation violates the client/user's intent.

### Changed — clearer naming for the same action bucket

These were already "retry with backoff" before, but mapped to `networkFailure`. They now map to `timeoutFailure`, which is more honest:

- `408` Request Timeout
- `504` Gateway Timeout

### Added — newly mapped HTTP codes

Previously fell through to a generic 5xx/4xx default; now mapped to the action category they actually warrant:

- `410 Gone` → `missing`
- `521 Cloudflare Web Server Is Down` → `networkFailure`
- `522 Cloudflare Connection Timed Out` → `timeoutFailure`
- `523 Cloudflare Origin Is Unreachable` → `networkFailure`
- `527 Cloudflare Railgun Listener to Origin` → `networkFailure`
- `598 Network Read Timeout` (IIS) → `timeoutFailure`
- `599 Network Connect Timeout` (IIS) → `timeoutFailure`

### Fixed

- `isRetryableFailure` no longer returns `true` for `aborted` — auto-retry would violate the client/user's deliberate cancellation.

### Documentation

- README rewritten to lead with the package's actual purpose and the **action categories** table, with a follow-up section explaining why there are more statuses than action categories (severity / logging granularity).
- Inline comments added to every explicitly-handled HTTP code in the conversion function so each weird edge case is self-documenting.
- Docstrings rewritten for `serverFailure` (idempotency / "may or may not have happened"), `networkFailure` / `timeoutFailure` (always safe to retry with backoff), `aborted` (do NOT auto-retry), and updated HTTP code lists across `clientFailure`, `clientFailureNotAuthorized`, and `missing`.

### Migration notes

If your code matches on specific statuses:

- Anything matching `missing` to detect 501 needs to switch to `clientFailure` (or check the raw HTTP code if you really need to distinguish).
- Anything matching `clientFailure` to detect 530 needs to switch to `serverFailure`.
- Anything relying on `serverFailure` to cover 502/503/504 should use `isRetryableFailure` (covers `networkFailure` + `timeoutFailure`) or check those statuses directly.
- Anything relying on `isRetryableFailure` returning true for `aborted` should be reconsidered — that was always semantically wrong.
