import { isString } from '@art-suite/art-core-ts-types';
import { aborted, clientFailureNotAuthorized, disabled, missing, networkFailure, pending, success, timeoutFailure } from './CommunicationStatusConsts';
import { getCommunicationStatus, getCommunicationStatusDetails } from './CommunicationStatusConversions';
import { HttpOrCommunicationStatus, statusRegex } from './CommunicationStatusTypes';

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
 * Returns true for client-side errors
 *
 * HTTP Status Codes Covered:
 * - 400: Bad Request
 * - 401: Unauthorized
 * - 403: Forbidden
 * - 407: Proxy Authentication Required
 * - 409: Conflict
 * - 422: Unprocessable Entity
 *
 * Client Can Automatically:
 * - Notify the user that the client is experiencing issues
 *
 * Client Developer Can:
 * - use isClientFailureNotAuthorized to check for 401/403/407/451
 * - fix the request to avoid the 4xx error
*/
export const isClientFailure = (status: HttpOrCommunicationStatus | null | undefined): boolean => !!(status && getCommunicationStatusDetails(status).clientFailure);

/**
 * Returns true for server-side errors
 *
 * HTTP Status Codes Covered:
 * - 500: Internal Server Error
 * - 502: Bad Gateway
 * - 503: Service Unavailable
 * - 504: Gateway Timeout
 *
 * Client Can Automatically:
 * - Ask the user to try again later
 * - Notify the user that the server is experiencing issues
 *
 * Client Developer: (probably) can't fix
 *
 * Server Developer Can:
 * - fix the server to avoid the 5xx error
 * - fix server infrastructure to avoid the 5xx error (e.g. Bad Gateway, Service Unavailable, Gateway Timeout)
*/
export const isServerFailure = (status: HttpOrCommunicationStatus | null | undefined): boolean => !!(status && getCommunicationStatusDetails(status).serverFailure);

/**
 * Returns true when request fails due to network connectivity issues
 *
 * HTTP Status Codes Covered: NONE (server was not reachable)
 *
 * Client Can Automatically:
 * - Prompt the user to fix the network connection
 * - Retry the request
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
 * Returns true when resource not found / not available
 *
 * HTTP Status Codes Covered:
 * - 404: Not Found
 * - 501: Not Implemented
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
 * Returns true if the request timed out
 *
 * Client Can Automatically:
 * - notify the user that the request timed out
 * - try again (automatically or via user action)
 *
 * Client Developer Can:
 * - extend the timeoutFailure duration
 *
 * Server Developer Can:
 * - improve server performance and reliability
 */
export const isTimeout = (status: HttpOrCommunicationStatus | null | undefined): boolean => !!(status && getCommunicationStatus(status) === timeoutFailure);

/**
 * Returns true if client can safely retry the request
 *
 * A a clearly-retryable failure:
 *
 * - network failure
 * - timeoutFailure
 * - aborted
 *
 * Note: some serverFailures will succeed on retry, but HTTP doesn't return clear indications which ones. To be safe, the client should not retry serverFailures indiscriminately.
 *
 * Client and Server Devs can
 * - investigate network, client and server performance and reliability issues
 */
export const isRetryableFailure = (status: HttpOrCommunicationStatus | null | undefined): boolean => {
  if (!status) return false;
  const { status: communicationStatus, failure } = getCommunicationStatusDetails(status);
  return !!(failure && (communicationStatus === networkFailure || communicationStatus === timeoutFailure || communicationStatus === aborted));
};

/**
 * Returns true if the status is a valid communication status
 */
export const isStatusValid = (status: string | null | undefined): boolean => !!(isString(status) && statusRegex.test(status));

export const isDisabled = (status: HttpOrCommunicationStatus | null | undefined): boolean => !!(status && getCommunicationStatus(status) === disabled);
