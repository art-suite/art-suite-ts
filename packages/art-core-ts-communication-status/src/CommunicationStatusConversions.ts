import { clientFailure, clientFailureNotAuthorized, missing, networkFailure, serverFailure, success } from './CommunicationStatusConsts';
import { isStatusValid } from './CommunicationStatusTests';
import { CommunicationStatus, CommunicationStatusDetails, communicationStatuses } from './CommunicationStatusTypes';

//***************************************************************************************************************
// Private Helpers
//***************************************************************************************************************
const getCommunicationStatusFromHttpStatusOrUndefined = (httpStatus: number): CommunicationStatus | undefined => {
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
 * Throws: Error if the HTTP status code is not supported (i.e. the 100 codes or non HTTP status code numbers)
 *
 * @param status - The HTTP status code to get the communication status for
 * @returns The CommunicationStatusDetails for the given status. Note, if an HTTP status is given, it won't necessarily be the httpStatus returned; HTTPStatuses are simplified along with CommunicationStatuses.
 */
export const getCommunicationStatusDetails = <T extends number | CommunicationStatus | null | undefined>(status: T):
  T extends null | undefined ? undefined : CommunicationStatusDetails => {
  if (status == null) return undefined as any;
  const communicationStatus = getCommunicationStatus(status);
  return communicationStatuses[communicationStatus] as any;
};

export const getCommunicationStatusDetailsOrUndefined = <T extends number | CommunicationStatus | null | undefined>(
  status: T
): T extends null | undefined ? undefined : (CommunicationStatusDetails | undefined) => {
  if (status == null) return undefined as any;
  const communicationStatus = getCommunicationStatusOrUndefined(status);
  if (communicationStatus == null) return undefined as any;
  return communicationStatuses[communicationStatus] as any;
};
