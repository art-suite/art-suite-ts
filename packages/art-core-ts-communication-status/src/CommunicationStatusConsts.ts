// Export status constants
import type { CommunicationStatus } from './CommunicationStatusTypes';

/**
 * HTTP 2xx responses
 *
 * Client Can Automatically:
 * - Process the successful response
 * - Update UI to reflect success
 *
 * Client Developer Can:
 * - Handle the successful response data
 */
export const success: CommunicationStatus = "success";

/**
 * Resource (data) doesn't exist — whether it never did or was deliberately removed.
 * Don't retry; look elsewhere.
 *
 * This is a *resource* concern, not a request-shape concern. If the server can't
 * even *attempt* the operation (wrong method, unimplemented capability), that's a
 * clientFailure, not missing.
 *
 * HTTP Status Codes Covered:
 * - 3xx: Redirects (HTTP client should follow transparently)
 * - 404: Not Found
 * - 410: Gone (permanently removed)
 *
 * Client Can Automatically:
 * - notify the user that the resource was not found
 * - prompt the user to request a different resource
 *
 * Client Developer Can:
 * - fix the bad resource paths
 */
export const missing: CommunicationStatus = "missing";

/**
 * Client-side error — the request itself is wrong; fix it before retrying.
 *
 * HTTP Status Codes Covered:
 * - 400: Bad Request
 * - 405: Method Not Allowed
 * - 406: Not Acceptable
 * - 409: Conflict
 * - 411-417: various malformed-request errors
 * - 421: Misdirected Request
 * - 422: Unprocessable Entity
 * - 424: Failed Dependency
 * - 426: Upgrade Required
 * - 428: Precondition Required
 * - 431: Request Header Fields Too Large
 * - 501: Not Implemented (5xx but really a request-capability problem; server can't do what you asked)
 * - 505: HTTP Version Not Supported (a 5xx code that's semantically a client problem)
 *
 * Client Can Automatically:
 * - Notify the user that the client is experiencing issues
 * - Prompt user to correct invalid input
 *
 * Client Developer Can:
 * - use isClientFailureNotAuthorized to check for 401/403/407/451/511
 * - fix the request to avoid the 4xx error
 * - validate input before sending requests
 */
export const clientFailure: CommunicationStatus = "clientFailure";

/**
 * Unauthorized request — needs new/refreshed credentials or different grants.
 *
 * HTTP Status Codes Covered:
 * - 401: Unauthorized
 * - 403: Forbidden
 * - 407: Proxy Authentication Required
 * - 451: Unavailable For Legal Reasons
 * - 511: Network Authentication Required (captive portals)
 *
 * Client Can Automatically:
 * - refresh the request token
 * - prompt the user to re-login
 * - ask the user to contact the administrator for access
 *
 * Client and Server Developer Can:
 * - fix authorization / authentication bugs
 */
export const clientFailureNotAuthorized: CommunicationStatus = "clientFailureNotAuthorized";

/**
 * Server-side logic failure — the operation may or may not have completed.
 *
 * HTTP Status Codes Covered:
 * - 500: Internal Server Error
 * - 506: Variant Also Negotiates
 * - 507: Insufficient Storage
 * - 508: Loop Detected
 * - 510: Not Extended
 * - 525: SSL Handshake Failed (Cloudflare config issue)
 * - 526: Invalid SSL Certificate (Cloudflare config issue)
 * - 530: Cloudflare wraps origin error
 *
 * UNLIKE networkFailure / timeoutFailure, serverFailure is NOT safe to blindly
 * retry — the server may have already applied the operation before failing to
 * reply. Right behavior depends on the API:
 *
 * Client Can:
 * - For reads / idempotent operations: retry with backoff
 * - For writes the API guarantees idempotent: retry with backoff
 * - For non-idempotent writes: query the API to check whether the write happened,
 *   or surface the failure to the user and let them decide
 * - Notify the user that the server is experiencing issues
 *
 * Server Developer Can:
 * - fix the server bug causing the 5xx
 * - fix server infrastructure to avoid the 5xx error
 */
export const serverFailure: CommunicationStatus = "serverFailure";

/**
 * Transport-level failure — request didn't get a clean round-trip.
 * Safe to retry with backoff (honor Retry-After when present).
 *
 * HTTP Status Codes Covered:
 * - 423: Locked (resource temporarily locked)
 * - 425: Too Early (server won't risk replay)
 * - 429: Too Many Requests (rate-limited)
 * - 502: Bad Gateway
 * - 503: Service Unavailable
 * - 521: Web Server Is Down (Cloudflare)
 * - 523: Origin Is Unreachable (Cloudflare)
 * - 527: Railgun Listener to Origin (Cloudflare)
 * - Plus any non-HTTP transport failure: DNS lookup failed, TCP refused,
 *   TLS handshake error, lost connection, no route to host, etc.
 *
 * Client Can Automatically:
 * - Retry with backoff (honor Retry-After when present)
 * - Prompt the user to fix the network connection if persistent
 * - Monitor network status for recovery
 *
 * Client Developer Can:
 * - fix bad network constants (like address, ports, etc.)
 * - implement offline-first capabilities
 */
export const networkFailure: CommunicationStatus = "networkFailure";

/**
 * Request was cancelled by the client (e.g. AbortController, user navigated away).
 *
 * Do NOT auto-retry — the client/user made an explicit decision to stop the
 * request, and auto-retry would violate that intent. Any retry must come from
 * explicit user action.
 *
 * Client Can Automatically:
 * - notify the user that the request was cancelled
 * - prompt the user to try again (via explicit user action)
 * - cleanup any pending state
 *
 * Client Developer Can:
 * - fix the client to not abort the request unnecessarily
 * - implement proper cleanup on abort
 */
export const aborted: CommunicationStatus = "aborted";

/**
 * Request is in progress
 *
 * Client Can Automatically:
 * - notify the user that the request is in progress
 * - show the user progress (if available)
 * - allow the user to cancel the request
 *
 * Client Developer Can:
 * - if "pending" was not expected, maybe the client needs to `wait` for the request to complete?
 * - implement proper loading states
 */
export const pending: CommunicationStatus = "pending";

/**
 * Any error response (HTTP 4xx/5xx) or network/abort failures
 *
 * HTTP Status Codes Covered:
 * - 4xx: Client-side errors (except 404)
 * - 5xx: Server-side errors
 * - Network failures
 * - Abort failures
 *
 * Client Can Automatically:
 * - Show appropriate error message to user
 * - Implement generic error handling
 * - Log errors for debugging
 *
 * Client Developer Can:
 * - Use more specific is* functions for targeted error handling
 * - Implement proper error recovery strategies
 */
export const failure: CommunicationStatus = "failure";

/**
 * Request exceeded a timeout deadline. Safe to retry with backoff.
 *
 * HTTP Status Codes Covered:
 * - 408: Request Timeout (client took too long to send)
 * - 504: Gateway Timeout (upstream server didn't respond in time)
 * - 522: Connection Timed Out (Cloudflare — origin TCP handshake timed out)
 * - 524: A Timeout Occurred (Cloudflare — origin started replying but didn't finish)
 * - 598: Network Read Timeout (informal / IIS)
 * - 599: Network Connect Timeout (informal / IIS)
 * - Plus client-side timeouts (fetch / XHR aborted by timeout)
 *
 * Client Can Automatically:
 * - notify the user that the request timed out
 * - retry with backoff (auto or via user action)
 *
 * Client Developer Can:
 * - extend the timeout duration if appropriate
 * - investigate latency / server performance
 */
export const timeoutFailure: CommunicationStatus = "timeoutFailure";

/**
 * Client has disabled the request explicitly.
 *
 * Client Can:
 * - re-enable the request
 */
export const disabled: CommunicationStatus = "disabled";

/**
 * Unknown communication status
 *
 * Client Can:
 * - log the unknown status for debugging
 */
export const unknown: CommunicationStatus = "unknown";
