import { object } from '@art-suite/art-core-ts-comprehensions';

const communicationStatusesPartials = {
  // HTTP Success Statuses
  success: { httpStatus: 200 },

  // HTTP Failure Statuses
  missing: { httpStatus: 404, failure: true },
  clientFailure: { httpStatus: 400, clientFailure: true, failure: true },
  clientFailureNotAuthorized: { httpStatus: 403, clientFailure: true, failure: true },
  serverFailure: { httpStatus: 500, failure: true, serverFailure: true },
  failure: { httpStatus: 500, failure: true },

  // Non-HTTP Statuses
  pending: { httpStatus: undefined },
  networkFailure: { httpStatus: undefined, failure: true },
  aborted: { httpStatus: undefined, failure: true },
  timeoutFailure: { httpStatus: undefined, failure: true },
  disabled: { httpStatus: undefined },
  unknown: { httpStatus: undefined, failure: true }
};

/**
 * The core of Art-core-ts-communication-status: A simplified set of statuses as a human-readable and machine-interpretable string
 * representing all the possible communication statuses that are pragmatically actionable.
 */
export type CommunicationStatus = keyof typeof communicationStatusesPartials;

export type HttpOrCommunicationStatus = CommunicationStatus | number;

/**
 * Details about a communication status
 *
 * @param httpStatus - The HTTP status code for the communication status
 * @param failure - Whether the communication status is a failure
 * @param clientFailure - Whether the communication status is a client failure
 * @param serverFailure - Whether the communication status is a server failure
 * @param status - The communication status - alias for communicationStatus
 * @param communicationStatus - The communication status
 */
export interface CommunicationStatusDetails {
  httpStatus?: number;
  failure?: boolean;
  clientFailure?: boolean;
  serverFailure?: boolean;
  status: CommunicationStatus;
  communicationStatus: CommunicationStatus;
  message: string;
}

export const UnknownCommunicationStatusDetails: CommunicationStatusDetails = {
  status: 'unknown',
  communicationStatus: 'unknown',
  message: 'Unknown communication status',
  failure: true
};

export const communicationStatuses: Record<CommunicationStatus, CommunicationStatusDetails> = object(communicationStatusesPartials, (details: any, status) => ({
  ...details,
  failure: !!details.failure,
  clientFailure: !!details.clientFailure,
  serverFailure: !!details.serverFailure,
  status: status as CommunicationStatus,
  communicationStatus: status as CommunicationStatus,
  message: details.httpStatus ? `${status} (${details.httpStatus})` : status
})) as Record<CommunicationStatus, CommunicationStatusDetails>;

export type CommunicationStatuses = typeof communicationStatuses;

/**
 * RegEx returns true for all valid communication statuses
 */
export const statusRegex = new RegExp(`^(${Object.keys(communicationStatuses).join('|')})$`);
