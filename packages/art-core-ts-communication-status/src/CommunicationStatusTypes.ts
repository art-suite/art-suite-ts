import { object } from '@art-suite/art-core-ts-comprehensions';
export interface CommunicationStatusDetails {
  httpStatus?: number;
  failure?: boolean;
  clientFailure?: boolean;
  serverFailure?: boolean;
  status: CommunicationStatus;
  message: string;
}

const communicationStatusesPartials = {
  success: { httpStatus: 200 },
  missing: { httpStatus: 404, failure: true },
  clientFailure: { httpStatus: 400, clientFailure: true, failure: true },
  clientFailureNotAuthorized: { httpStatus: 403, clientFailure: true, failure: true },
  serverFailure: { httpStatus: 500, failure: true, serverFailure: true },
  networkFailure: { httpStatus: undefined, failure: true },
  aborted: { httpStatus: undefined, failure: true },
  pending: { httpStatus: undefined },
  failure: { httpStatus: 500, failure: true },
  timeoutFailure: { httpStatus: undefined, failure: true }
};

export type CommunicationStatus = keyof typeof communicationStatusesPartials;

export const communicationStatuses: Record<CommunicationStatus, CommunicationStatusDetails> = object(communicationStatusesPartials, (details, status) => ({
  ...details,
  status: status as CommunicationStatus,
  message: details.httpStatus ? `${status} (${details.httpStatus})` : status
})) as Record<CommunicationStatus, CommunicationStatusDetails>;

export type CommunicationStatuses = typeof communicationStatuses;

/**
 * RegEx returns true for all valid communication statuses
 */
export const statusRegex = new RegExp(`^(${Object.keys(communicationStatuses).join('|')})$`);
