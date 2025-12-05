// Export status constants
import type { CommunicationStatus } from './CommunicationStatusTypes'

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
export const success: CommunicationStatus = "success"

/**
 * Resource not found
 *
 * HTTP Status Codes Covered:
 * - 404: Not Found
 *
 * Client Can Automatically:
 * - notify the user that the resource was not found
 * - prompt the user to request a different resource
 *
 * Client Developer Can:
 * - fix the bad resource paths
 */
export const missing: CommunicationStatus = "missing"

/**
 * Client-side errors; i.e. the client needs to change the request somehow to succeed
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
 * - Prompt user to correct invalid input
 *
 * Client Developer Can:
 * - use isClientFailureNotAuthorized to check for 401/403/407/451
 * - fix the request to avoid the 4xx error
 * - validate input before sending requests
 */
export const clientFailure: CommunicationStatus = "clientFailure"

/**
 * Unauthorized requests; i.e. client needs to change the credentials (or the grants for the current credentials) to succeed
 *
 * HTTP Status Codes Covered:
 * - 401: Unauthorized
 * - 403: Forbidden
 * - 407: Proxy Authentication Required
 * - 451: Unavailable For Legal Reasons
 *
 * Client Can Automatically:
 * - refresh the request token
 * - prompt the user to re-login
 * - ask the user to contact the administrator for access
 *
 * Client and Server Developer Can:
 * - fix authorization / authentication bugs
 */
export const clientFailureNotAuthorized: CommunicationStatus = "clientFailureNotAuthorized"

/**
 * Server-side errors; i.e. internal server errors
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
 * - Implement automatic retry with backoff
 *
 * Client Developer: (probably) can't fix
 *
 * Server Developer Can:
 * - fix the server to avoid the 5xx error
 * - fix server infrastructure to avoid the 5xx error
 */
export const serverFailure: CommunicationStatus = "serverFailure"

/**
 * Request fails due to network connectivity issues
 *
 * HTTP Status Codes Covered: NONE (server was not reachable)
 *
 * Client Can Automatically:
 * - Prompt the user to fix the network connection
 * - Retry the request when network is available
 * - Monitor network status for recovery
 *
 * Client Developer Can:
 * - fix bad network constants (like address, ports, etc.)
 * - implement offline-first capabilities
 */
export const networkFailure: CommunicationStatus = "networkFailure"

/**
 * Request was cancelled by client
 *
 * Client Can Automatically:
 * - notify the user that the request was cancelled
 * - prompt the user to try again
 * - cleanup any pending state
 *
 * Client Developer Can:
 * - fix the client to not abort the request unnecessarily
 * - implement proper cleanup on abort
 */
export const aborted: CommunicationStatus = "aborted"

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
export const pending: CommunicationStatus = "pending"

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
export const failure: CommunicationStatus = "failure"

/**
 * Request timed out
 *
 * Client Can Automatically:
 * - notify the user that the request timed out
 * - try again (automatically or via user action)
 *
 * Client Developer Can:
 * - fix the client to not timeoutFailure the request
 * - implement proper timeoutFailure handling
 */
export const timeoutFailure: CommunicationStatus = "timeoutFailure"
