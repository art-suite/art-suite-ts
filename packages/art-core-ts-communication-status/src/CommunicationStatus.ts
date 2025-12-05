import { clientFailure, clientFailureNotAuthorized, missing, networkFailure, serverFailure, success } from './CommunicationStatusConsts';
import { isStatusValid } from './CommunicationStatusTests';
import { CommunicationStatus, CommunicationStatusDetails, communicationStatuses } from './CommunicationStatusTypes';

export const getCommunicationStatusFromHttpStatusOrUndefined = (httpStatus: number): CommunicationStatus | undefined => {
  switch (Math.floor(httpStatus / 100)) {
    case 2: return success;
    case 3: return missing;
    case 4:
      switch (httpStatus) {
        case 401:
        case 403:
        case 407:
        case 451: return clientFailureNotAuthorized;
        case 404: return missing;
        default: return clientFailure;
      }
    case 5:
      switch (httpStatus) {
        case 502:
        case 503:
        case 504: return networkFailure;
        case 511: return clientFailureNotAuthorized;
        case 501: return missing; // 501 Not Implemented - i.e. it "does not exist" currently - i.e. missing
        case 505: // HTTP Version Not Supported - client should change the request
        case 530: return clientFailure;
        default: return serverFailure;
      }
  }
  return undefined;
};

export const getCommunicationStatusFromHttpStatus = (httpStatus: number): CommunicationStatus => {
  const status = getCommunicationStatusFromHttpStatusOrUndefined(httpStatus);
  if (!status) {
    throw new Error(`httpStatus ${httpStatus} is not a supported CommunicationStatus.`);
  }
  return status;
};

/**
 * Returns CommunicationStatusDetails {status, httpStatus, message} given an HTTP status code
 *
 * Throws: Error if the HTTP status code is not supported (i.e. the 100 codes or non HTTP status code numbers)
 *
 * @param httpStatus - The HTTP status code to get the communication status for
 * @returns The communication status for the given HTTP status code
 */
export const getCommunicationStatusDetails = (httpStatus?: number): CommunicationStatusDetails => {
  if (!httpStatus) return { status: networkFailure, message: "network failure" };

  const status = getCommunicationStatusFromHttpStatus(httpStatus);

  return {
    status,
    httpStatus,
    message: `${status} (${httpStatus})`
  };
};

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

export const getHttpStatus = (status: CommunicationStatus): number => {
  const httpStatus = communicationStatuses[status]?.httpStatus;
  if (!httpStatus) throw new Error(`There is no valid HttpStatus for ${status}.`);
  return httpStatus;
};
