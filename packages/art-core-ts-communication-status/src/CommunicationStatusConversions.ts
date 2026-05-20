import { clientFailure, clientFailureNotAuthorized, disabled, missing, networkFailure, serverFailure, success, timeoutFailure } from './CommunicationStatusConsts';
import { isStatusValid } from './CommunicationStatusTests';
import { CommunicationStatus, CommunicationStatusDetails, communicationStatuses, UnknownCommunicationStatusDetails } from './CommunicationStatusTypes';

//***************************************************************************************************************
// Private Helpers
//***************************************************************************************************************
/**
 * HTTP status → action-category mapping.
 *
 * The HTTP spec scatters transport problems, timeouts, auth, rate-limiting, and
 * "your request is malformed" across the same 4xx/5xx ranges, so you can't trust
 * a code's leading digit to decide what to do. 504 Gateway Timeout is a "5xx" but
 * really a timeout. 429 Too Many Requests is a "4xx" but really a transport-level
 * "back off and retry." 530 is a 5xx historically attributed to the client but
 * actually indicates the origin failing. That mess is why this library exists.
 *
 * Each code below is remapped to one of a small set of *action* categories the
 * client can actually act on. See README for the categories.
 */
const getCommunicationStatusFromHttpStatusOrUndefined = (httpStatus: number): CommunicationStatus | undefined => {
  if (httpStatus === 0) return disabled;
  switch (Math.floor(httpStatus / 100)) {
    case 2: return success;
    case 3: return missing; // 3xx redirects are protocol-level; HTTP client should follow transparently
    case 4:
      switch (httpStatus) {
        // -- Auth-related: prompt user / refresh credentials --
        case 401: // Unauthorized: missing or invalid credentials
        case 403: // Forbidden: authenticated but lacks permission
        case 407: // Proxy Authentication Required
        case 451: return clientFailureNotAuthorized; // Unavailable For Legal Reasons

        // -- Resource doesn't (or no longer) exists: don't retry, look elsewhere --
        case 404: // Not Found
        case 410: return missing; // Gone: resource was here, now permanently removed

        // -- Timeouts: safe to retry with backoff --
        case 408: return timeoutFailure; // Request Timeout: client took too long to send

        // -- Network/transport-level: safe to retry with backoff --
        case 423: // Locked: resource temporarily locked
        case 425: // Too Early: server unwilling to risk processing a replayed request
        case 429: return networkFailure; // Too Many Requests: rate-limited; honor Retry-After

        // -- Default: client sent something the server can't accept; fix the request --
        // (400 Bad Request, 405 Method Not Allowed, 406 Not Acceptable, 409 Conflict,
        // 411-417, 421 Misdirected Request, 422 Unprocessable Entity, 424, 426, 428, 431)
        default: return clientFailure;
      }
    case 5:
      switch (httpStatus) {
        // -- Auth-related --
        case 511: return clientFailureNotAuthorized; // Network Authentication Required (captive portals)

        // -- 5xx that's actually a client problem; don't retry, fix the request --
        // 501 is about request *capability* (method/feature not supported anywhere on this
        // server), not a missing *resource* — only the developer can resolve it. Same flavor
        // as 400/405/422: change what you're sending.
        case 501: // Not Implemented: server doesn't support this method/capability
        case 505: return clientFailure; // HTTP Version Not Supported: client must change the request

        // -- Timeouts: safe to retry with backoff --
        case 504: // Gateway Timeout: upstream server didn't respond in time
        case 522: // Cloudflare: Connection Timed Out (origin TCP handshake timed out)
        case 524: // Cloudflare: A Timeout Occurred (origin started but didn't finish in time)
        case 598: // (Informal / IIS) Network Read Timeout
        case 599: return timeoutFailure; // (Informal / IIS) Network Connect Timeout

        // -- Network/transport-level: safe to retry with backoff --
        case 502: // Bad Gateway: upstream returned an invalid response
        case 503: // Service Unavailable: server overloaded or in maintenance; honor Retry-After
        case 521: // Cloudflare: Web Server Is Down (origin refused the connection)
        case 523: // Cloudflare: Origin Is Unreachable (DNS / routing failure)
        case 527: return networkFailure; // Cloudflare: Railgun Listener to Origin error

        // -- Default: server-side logic failure; idempotency matters (see serverFailure docs) --
        // (500 Internal Server Error, 506 Variant Also Negotiates, 507 Insufficient Storage,
        // 508 Loop Detected, 510 Not Extended, 525/526 Cloudflare SSL config errors,
        // 530 Cloudflare-wrapped origin error)
        default: return serverFailure;
      }
  }
  return undefined;
};

const getCommunicationStatusFromHttpStatus = (httpStatus: number): CommunicationStatus => {
  const status = getCommunicationStatusFromHttpStatusOrUndefined(httpStatus);
  if (!status) {
    throw new Error(`httpStatus ${httpStatus} is not a supported CommunicationStatus.`);
  }
  return status;
};

//***************************************************************************************************************
// Public Functions
//***************************************************************************************************************
export const getCommunicationStatusOrUndefined = <T extends number | CommunicationStatus | null | undefined>(
  status: T
): T extends null | undefined ? undefined : (CommunicationStatus | undefined) => {
  if (status == null) return undefined as any;
  if (typeof status === 'string') {
    if (!isStatusValid(status)) {
      return undefined;
    }
    return status as any;
  }
  if (typeof status === 'number') {
    return getCommunicationStatusFromHttpStatusOrUndefined(status) as any;
  }
  return undefined;
};

/*
 * Returns the CommunicationStatus for a given CommunicationStatus or number
 * If the input is null or undefined, returns undefined, otherwise throws an error if the CommunicationStatus or number is not supported
 * @param status - The CommunicationStatus or number to get the CommunicationStatus for
 * @returns The CommunicationStatus for the given CommunicationStatus or number
 */
export const getCommunicationStatus = <T extends number | CommunicationStatus | null | undefined>(
  status: T
): T extends null | undefined ? undefined : CommunicationStatus => {
  if (status == null) return undefined as any;
  if (typeof status === 'number') {
    return getCommunicationStatusFromHttpStatus(status) as any;
  }
  const communicationStatus: CommunicationStatus | undefined = getCommunicationStatusOrUndefined(status);
  if (!communicationStatus) {
    throw new Error(`${status} is not a valid CommunicationStatus.`);
  }
  return communicationStatus as any;
};

/**
 * Returns the HTTP status code for a given CommunicationStatus or number
 * If the input is null or undefined, returns undefined, otherwise throws an error if the CommunicationStatus or number is not supported
 * @param status - The CommunicationStatus or number to get the HTTP status code for
 * @returns The HTTP status code for the given CommunicationStatus or number
 */
export const getHttpStatus = <T extends CommunicationStatus | number | null | undefined>(status: T): T extends null | undefined ? undefined : number => {
  if (status == null) return undefined as any;
  const communicationStatus = getCommunicationStatus(status);
  const httpStatus = communicationStatuses[communicationStatus].httpStatus;
  if (httpStatus == null) {
    throw new Error(`There is no valid HttpStatus for ${status}.`);
  }
  return httpStatus as any;
};

/**
 * Returns CommunicationStatusDetails {status, httpStatus, message} given an HTTP status code
 *
 * Never throws - returns UnknownCommunicationStatusDetails for invalid inputs
 *
 * @param status - The HTTP status code to get the communication status for
 * @returns The CommunicationStatusDetails for the given status. Note, if an HTTP status is given, it won't necessarily be the httpStatus returned; HTTPStatuses are simplified along with CommunicationStatuses.
 */
export function getCommunicationStatusDetails(status: null | undefined): undefined;
export function getCommunicationStatusDetails(status: number | CommunicationStatus): CommunicationStatusDetails;
export function getCommunicationStatusDetails(status: number | CommunicationStatus | null | undefined): CommunicationStatusDetails | undefined {
  if (status == null) return undefined;

  try {
    const communicationStatus = getCommunicationStatus(status);
    const details: CommunicationStatusDetails = communicationStatuses[communicationStatus] ?? UnknownCommunicationStatusDetails;
    return details;
  } catch {
    return UnknownCommunicationStatusDetails;
  }
}

export function getCommunicationStatusDetailsOrUndefined(status: null | undefined): undefined;
export function getCommunicationStatusDetailsOrUndefined(status: number | CommunicationStatus): CommunicationStatusDetails | undefined;
export function getCommunicationStatusDetailsOrUndefined(status: number | CommunicationStatus | null | undefined): CommunicationStatusDetails | undefined {
  if (status == null) return undefined;
  const communicationStatus = getCommunicationStatusOrUndefined(status);
  if (communicationStatus == null) return undefined;
  const details: CommunicationStatusDetails | undefined = communicationStatuses[communicationStatus];
  return details;
}
