interface CommunicationStatusInfo {
  httpStatus?: number
  failure?: boolean
  clientFailure?: boolean
  serverFailure?: boolean
}

export const communicationStatuses: Record<string, CommunicationStatusInfo> = {
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

export type CommunicationStatuses = typeof communicationStatuses
export type CommunicationStatus = keyof CommunicationStatuses

/**
 * RegEx returns true for all valid communication statuses
 */
export const statusRegex = new RegExp(`^(${Object.keys(communicationStatuses).join('|')})$`)

export interface CommunicationStatusDetails {
  status: CommunicationStatus
  httpStatus?: number
  message: string
}
