import { isString } from '@art-suite/art-core-ts-types';
import { aborted, clientFailureNotAuthorized, disabled, missing, networkFailure, pending, success, timeoutFailure } from './CommunicationStatusConsts';
import { getCommunicationStatus, getCommunicationStatusDetails, getCommunicationStatusOrUndefined } from './CommunicationStatusConversions';
import { CommunicationStatus, HttpOrCommunicationStatus, statusRegex } from './CommunicationStatusTypes';

// Core status check functions
/** Returns true for HTTP 2xx responses */
export const isSuccess = (status: HttpOrCommunicationStatus | null | undefined): boolean => !!status && getCommunicationStatus(status) === success;

/**
 * Returns true for any error response (HTTP 4xx/5xx) or network/abort failures
 *
 * HTTP Status Codes Covered:
 * - 4xx: Client-side errors (except 404)
 * - 5xx: Server-side errors
 * - Network failures
 * - Abort failures
 *
 * Client Can:
 * - Use a different is* function for more specific checks
 */
export const isFailure = (status: HttpOrCommunicationStatus | null | undefined): boolean => !!(status && getCommunicationStatusDetails(status).failure);

/**
 * Returns true for client-side errors — fix the request before retrying.
 *
 * HTTP Status Codes Covered:
 * - 400 Bad Request, 405 Method Not Allowed, 406 Not Acceptable
 * - 409 Conflict, 411-417, 421 Misdirected Request, 422 Unprocessable Entity
 * - 424 Failed Dependency, 426, 428, 431
 * - 501 Not Implemented (5xx but really a request-capability problem)
 * - 505 HTTP Version Not Supported
 *
 * Note: isClientFailure also returns true for clientFailureNotAuthorized (since
 * auth errors are a kind of client error).
 *
 * Client Can Automatically:
 * - Notify the user that the client is experiencing issues
 *
 * Client Developer Can:
 * - use isClientFailureNotAuthorized to distinguish 401/403/407/451/511
 * - fix the request to avoid the 4xx error
*/
export const isClientFailure = (status: HttpOrCommunicationStatus | null | undefined): boolean => !!(status && getCommunicationStatusDetails(status).clientFailure);

/**
 * Returns true for server-side logic failures.
 *
 * HTTP Status Codes Covered:
 * - 500 Internal Server Error
 * - 506, 507, 508, 510 (various server-state errors)
 * - 525, 526 (Cloudflare SSL config errors)
 * - 530 (Cloudflare wraps origin error)
 *
 * UNLIKE networkFailure / timeoutFailure (which are safe to auto-retry with
 * backoff), serverFailure is NOT safe to blindly retry — the server may have
 * already applied the operation before failing to reply. For non-idempotent
 * writes, query the API to check state, or surface the failure to the user.
 *
 * Client Can:
 * - For reads / idempotent writes: retry with backoff
 * - For non-idempotent writes: check the API or prompt the user
 *
 * Server Developer Can:
 * - fix the server bug causing the 5xx
*/
export const isServerFailure = (status: HttpOrCommunicationStatus | null | undefined): boolean => !!(status && getCommunicationStatusDetails(status).serverFailure);

/**
 * Returns true for transport-level failures — safe to retry with backoff.
 *
 * HTTP Status Codes Covered:
 * - 423 Locked, 425 Too Early, 429 Too Many Requests (rate-limit)
 * - 502 Bad Gateway, 503 Service Unavailable
 * - 521, 523, 527 (Cloudflare origin-unreachable variants)
 * - Plus any non-HTTP transport failure (DNS, TCP refused, TLS, lost connection)
 *
 * Client Can Automatically:
 * - Retry with backoff (honor Retry-After when present)
 * - Prompt the user to fix the network connection if persistent
 *
 * Client Developer Can:
 * - fix bad network constants (like address, ports, etc.)
*/
export const isNetworkFailure = (status: HttpOrCommunicationStatus | null | undefined): boolean => !!(status && getCommunicationStatus(status) === networkFailure);

/** Returns true for server errors, network failures and aborted requests; i.e. the client did nothing wrong (as far as we can tell); client can ask the user to do something OR retry the request */
export const isNonClientFailure = (status: HttpOrCommunicationStatus | null | undefined): boolean => {
  if (!status) return false;
  const details = getCommunicationStatusDetails(status);
  return !!(details.failure && !details.clientFailure);
};

/**
 * Returns true for unauthorized requests (not authenticated or not authorized)
 *
 * HTTP Status Codes Covered:
 * - 401: Unauthorized
 * - 403: Forbidden
 * - 407: Proxy Authentication Required
 * - 451: Unavailable For Legal Reasons
 * - 511: Network Authentication Required
 *
 * Client Can Automatically:
 * - refresh the request token
 * - prompt the user to re-login
 * - ask the user to contact the administrator for access
 *
 * Client and Server Developer Can:
 * - fix authorization / authentication bugs
 */
export const isClientFailureNotAuthorized = (status: HttpOrCommunicationStatus | null | undefined): boolean =>
  !!status &&
  getCommunicationStatus(status) === clientFailureNotAuthorized;

/**
 * Returns true when request was cancelled by client
 *
 * Client Can Automatically:
 * - notify the user that the request was cancelled
 * - prompt the user to try again
 *
 * Client Developer Can:
 * - fix the client to not abort the request
 */
export const isAborted = (status: HttpOrCommunicationStatus | null | undefined): boolean => !!(status && getCommunicationStatus(status) === aborted);

/**
 * Returns true when the requested resource (data) doesn't exist.
 *
 * HTTP Status Codes Covered:
 * - 3xx: Redirects
 * - 404: Not Found
 * - 410: Gone (permanently removed)
 *
 * Note: 501 Not Implemented is NOT included here — it's a request-capability
 * problem (wrong method/feature), not a missing-resource problem, so it maps
 * to clientFailure.
 *
 * Client Can Automatically:
 * - notify the user that the resource was not found
 * - prompt the user to request a different resource
 *
 * Client Developer Can:
 * - fix the bad resource paths
 */
export const isMissing = (status: HttpOrCommunicationStatus | null | undefined): boolean => !!(status && getCommunicationStatus(status) === missing);

/**
 * Returns true while request is in progress
 *
 * Client Can Automatically:
 * - notify the user that the request is in progress
 * - show the user progress (if available)
 * - allow the user to cancel the request (trigging an "aborted" communication status)
 *
 * Client Developer Can:
 * - if "pending" was not expected, maybe the client needs to `wait` for the request to complete?
 */
export const isPending = (status: HttpOrCommunicationStatus | null | undefined): boolean => !!(status && getCommunicationStatus(status) === pending);

/**
 * Returns true for timeout failures — safe to retry with backoff.
 *
 * HTTP Status Codes Covered:
 * - 408 Request Timeout
 * - 504 Gateway Timeout
 * - 522 Cloudflare Connection Timed Out
 * - 524 Cloudflare A Timeout Occurred
 * - 598, 599 (informal / IIS network timeouts)
 * - Plus client-side timeouts (fetch / XHR)
 *
 * Client Can Automatically:
 * - notify the user that the request timed out
 * - retry with backoff
 *
 * Client Developer Can:
 * - extend the timeout duration if appropriate
 *
 * Server Developer Can:
 * - improve server performance and reliability
 */
export const isTimeout = (status: HttpOrCommunicationStatus | null | undefined): boolean => !!(status && getCommunicationStatus(status) === timeoutFailure);

/**
 * Returns true if client can safely auto-retry the request (with backoff).
 *
 * Clearly-retryable failures:
 * - networkFailure (DNS, TCP, TLS, rate-limit, 502/503/etc.)
 * - timeoutFailure (408, 504, 524, client-side timeouts, etc.)
 *
 * Notably NOT retryable:
 * - serverFailure: the operation may or may not have completed; idempotency
 *   matters, so the caller must decide based on the API
 * - aborted: the client deliberately cancelled; auto-retry would violate intent
 * - clientFailure / missing / clientFailureNotAuthorized: retry won't help —
 *   fix the request or prompt the user
 *
 * Client and Server Devs can:
 * - investigate network, client and server performance and reliability issues
 */
export const isRetryableFailure = (status: HttpOrCommunicationStatus | null | undefined): boolean => {
  if (!status) return false;
  const { status: communicationStatus } = getCommunicationStatusDetails(status);
  return communicationStatus === networkFailure || communicationStatus === timeoutFailure;
};

/**
 * Returns true if the status is a valid communication status
 */
export const isStatusValid = (status: string | null | undefined): boolean => !!(isString(status) && statusRegex.test(status));

export const isDisabled = (status: HttpOrCommunicationStatus | null | undefined): boolean => !!(status && getCommunicationStatus(status) === disabled);

/**
 * Returns true if the status is a valid communication status. True if it's a recognized HTTP status code number or a valid CommunicationStatus string. Otherwise false.
 * @param status - The status to check
 * @returns True if the status is a valid communication status
 */
export const isCommunicationStatus = (status: HttpOrCommunicationStatus | null | undefined): status is CommunicationStatus => !!(status && getCommunicationStatusOrUndefined(status) !== undefined);
