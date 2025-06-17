interface CommunicationStatusInfo {
  httpStatus?: number
  failure?: boolean
  clientFailure?: boolean
  serverFailure?: boolean
}

interface CommunicationStatuses {
  [key: string]: CommunicationStatusInfo
}

const communicationStatuses: CommunicationStatuses = {
  success: { httpStatus: 200 },
  missing: { httpStatus: 404, failure: true },
  clientFailure: { httpStatus: 400, clientFailure: true, failure: true },
  clientFailureNotAuthorized: { httpStatus: 403, clientFailure: true, failure: true },
  serverFailure: { httpStatus: 500, failure: true, serverFailure: true },
  networkFailure: { failure: true },
  aborted: { failure: true },
  pending: {},
  failure: { httpStatus: 500, failure: true },
  timeoutFailure: { failure: true }
}

export type CommunicationStatus = "success" | "missing" | "clientFailure" | "clientFailureNotAuthorized" | "serverFailure" | "networkFailure" | "aborted" | "pending" | "failure" | "timeoutFailure"
/**
 * RegEx returns true for all valid communication statuses
 */
export const statusRegex = /^(success|missing|clientFailure|clientFailureNotAuthorized|serverFailure|networkFailure|aborted|pending|failure|timeoutFailure)$/

// Export status constants
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

// Core status check functions
/** Returns true for HTTP 2xx responses */
export const isSuccess = (status: CommunicationStatus) => status === success

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
export const isFailure = (status: CommunicationStatus) => !!communicationStatuses[status]?.failure

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
export const isClientFailure = (status: CommunicationStatus) => !!communicationStatuses[status]?.clientFailure

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
export const isServerFailure = (status: CommunicationStatus) => !!communicationStatuses[status]?.serverFailure

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
export const isNetworkFailure = (status: CommunicationStatus) => status === networkFailure

/** Returns true for server errors, network failures and aborted requests; i.e. the client did nothing wrong (as far as we can tell); client can ask the user to do something OR retry the request */
export const isNonClientFailure = (status: CommunicationStatus) => isFailure(status) && !isClientFailure(status)

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
export const isClientFailureNotAuthorized = (status: CommunicationStatus) => status === clientFailureNotAuthorized

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
export const isAborted = (status: CommunicationStatus) => status === aborted

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
export const isMissing = (status: CommunicationStatus) => status === missing

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
export const isPending = (status: CommunicationStatus) => status === pending

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
export const isTimeout = (status: CommunicationStatus) => status === timeoutFailure

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
export const isRetryableFailure = (status: CommunicationStatus) => isNetworkFailure(status) || isTimeout(status) || isAborted(status)

/**
 * Returns true if the status is a valid communication status
 */
export const isStatusValid = (status: string) => statusRegex.test(status);

interface CommunicationStatusDetails {
  status: CommunicationStatus
  httpStatus?: number
  message: string
}

/**
 * Returns CommunicationStatusDetails {status, httpStatus, message} given an HTTP status code
 *
 * Throws: Error if the HTTP status code is not supported (i.e. the 100 codes or non HTTP status code numbers)
 *
 * @param httpStatus - The HTTP status code to get the communication status for
 * @returns The communication status for the given HTTP status code
 */
export const getCommunicationStatusDetails = (httpStatus?: number): CommunicationStatusDetails => {
  if (!httpStatus) return { status: networkFailure, message: "network failure" }

  let status: CommunicationStatus | undefined

  switch (Math.floor(httpStatus / 100)) {
    case 2: status = success; break
    case 3: status = missing; break
    case 4:
      switch (httpStatus) {
        case 401:
        case 403:
        case 407:
        case 451: status = clientFailureNotAuthorized; break
        case 404: status = missing; break
        default: status = clientFailure
      }
      break
    case 5:
      switch (httpStatus) {
        case 502:
        case 503:
        case 504: status = networkFailure; break
        case 511: status = clientFailureNotAuthorized; break
        case 501: status = missing; break // 501 Not Implemented - i.e. it "does not exist" currently - i.e. missing
        case 505: // HTTP Version Not Supported - client should change the request
        case 530: status = clientFailure; break
        default: status = serverFailure; break
      }
      break
  }

  if (!status) throw new Error(`httpStatus ${httpStatus} is not a supported CommunicationStatus.`)

  return {
    status,
    httpStatus,
    message: `${status} (${httpStatus})`
  }
}

export const getCommunicationStatus = (httpStatus?: number): CommunicationStatus =>
  getCommunicationStatusDetails(httpStatus).status

export const getHttpStatus = (status: CommunicationStatus): number => {
  const httpStatus = communicationStatuses[status]?.httpStatus
  if (!httpStatus) throw new Error(`There is no valid HttpStatus for ${status}.`)
  return httpStatus
}