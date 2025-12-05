import { describe, expect, it } from 'vitest';
import {
  aborted,
  clientFailure,
  clientFailureNotAuthorized,
  failure,
  getCommunicationStatus,
  getCommunicationStatusDetails,
  getCommunicationStatusFromHttpStatusOrUndefined,
  getCommunicationStatusOrUndefined,
  getHttpStatus,
  isAborted,
  isClientFailure,
  isClientFailureNotAuthorized,
  isFailure,
  isMissing,
  isNetworkFailure,
  isNonClientFailure,
  isPending,
  isRetryableFailure,
  isServerFailure,
  isStatusValid,
  isSuccess,
  isTimeout,
  missing,
  networkFailure,
  pending,
  serverFailure,
  success,
  timeoutFailure
} from '../';

describe('CommunicationStatus', () => {
  describe('status constants', () => {
    it('should have correct values', () => {
      expect(success).toBe('success');
      expect(missing).toBe('missing');
      expect(clientFailure).toBe('clientFailure');
      expect(clientFailureNotAuthorized).toBe('clientFailureNotAuthorized');
      expect(serverFailure).toBe('serverFailure');
      expect(networkFailure).toBe('networkFailure');
      expect(aborted).toBe('aborted');
      expect(pending).toBe('pending');
      expect(failure).toBe('failure');
      expect(timeoutFailure).toBe('timeoutFailure');
    });
  });

  describe('status check functions', () => {
    it('isSuccess', () => {
      expect(isSuccess(success)).toBe(true);
      expect(isSuccess(failure)).toBe(false);
    });

    it('isFailure', () => {
      expect(isFailure(success)).toBe(false);
      expect(isFailure(failure)).toBe(true);
      expect(isFailure(clientFailure)).toBe(true);
      expect(isFailure(serverFailure)).toBe(true);
      expect(isFailure(networkFailure)).toBe(true);
      expect(isFailure(aborted)).toBe(true);
      expect(isFailure(timeoutFailure)).toBe(true);
      expect(isFailure(pending)).toBe(false);
    });

    it('isClientFailure', () => {
      expect(isClientFailure(clientFailure)).toBe(true);
      expect(isClientFailure(clientFailureNotAuthorized)).toBe(true);
      expect(isClientFailure(serverFailure)).toBe(false);
      expect(isClientFailure(success)).toBe(false);
    });

    it('isServerFailure', () => {
      expect(isServerFailure(serverFailure)).toBe(true);
      expect(isServerFailure(clientFailure)).toBe(false);
      expect(isServerFailure(success)).toBe(false);
    });

    it('isNetworkFailure', () => {
      expect(isNetworkFailure(networkFailure)).toBe(true);
      expect(isNetworkFailure(serverFailure)).toBe(false);
      expect(isNetworkFailure(success)).toBe(false);
    });

    it('isNonClientFailure', () => {
      expect(isNonClientFailure(serverFailure)).toBe(true);
      expect(isNonClientFailure(networkFailure)).toBe(true);
      expect(isNonClientFailure(aborted)).toBe(true);
      expect(isNonClientFailure(clientFailure)).toBe(false);
      expect(isNonClientFailure(success)).toBe(false);
    });

    it('isClientFailureNotAuthorized', () => {
      expect(isClientFailureNotAuthorized(clientFailureNotAuthorized)).toBe(true);
      expect(isClientFailureNotAuthorized(clientFailure)).toBe(false);
      expect(isClientFailureNotAuthorized(success)).toBe(false);
    });

    it('isAborted', () => {
      expect(isAborted(aborted)).toBe(true);
      expect(isAborted(failure)).toBe(false);
      expect(isAborted(success)).toBe(false);
    });

    it('isMissing', () => {
      expect(isMissing(missing)).toBe(true);
      expect(isMissing(failure)).toBe(false);
      expect(isMissing(success)).toBe(false);
    });

    it('isPending', () => {
      expect(isPending(pending)).toBe(true);
      expect(isPending(success)).toBe(false);
      expect(isPending(failure)).toBe(false);
    });

    it('isTimeout', () => {
      expect(isTimeout(timeoutFailure)).toBe(true);
      expect(isTimeout(failure)).toBe(false);
      expect(isTimeout(success)).toBe(false);
    });

    it('isRetryableFailure', () => {
      expect(isRetryableFailure(networkFailure)).toBe(true);
      expect(isRetryableFailure(timeoutFailure)).toBe(true);
      expect(isRetryableFailure(aborted)).toBe(true);
      expect(isRetryableFailure(serverFailure)).toBe(false);
      expect(isRetryableFailure(clientFailure)).toBe(false);
      expect(isRetryableFailure(success)).toBe(false);
    });

    it('isStatusValid', () => {
      expect(isStatusValid('success')).toBe(true);
      expect(isStatusValid('failure')).toBe(true);
      expect(isStatusValid('invalid')).toBe(false);
      expect(isStatusValid('')).toBe(false);
    });
  });

  describe('getCommunicationStatus', () => {
    it('should return the correct status for valid HTTP status codes', () => {
      expect(getCommunicationStatus(200)).toBe(success);
      expect(getCommunicationStatus(404)).toBe(missing);
      expect(getCommunicationStatus(400)).toBe(clientFailure);
      expect(getCommunicationStatus(401)).toBe(clientFailureNotAuthorized);
      expect(getCommunicationStatus(500)).toBe(serverFailure);
      expect(getCommunicationStatus(502)).toBe(networkFailure);
    });

    it('should return the correct status for valid status strings', () => {
      expect(getCommunicationStatus(success)).toBe(success);
      expect(getCommunicationStatus(missing)).toBe(missing);
      expect(getCommunicationStatus(clientFailure)).toBe(clientFailure);
      expect(getCommunicationStatus(serverFailure)).toBe(serverFailure);
      expect(getCommunicationStatus(networkFailure)).toBe(networkFailure);
    });

    it('should return undefined for null and undefined inputs', () => {
      expect(getCommunicationStatus(null)).toBeUndefined();
      expect(getCommunicationStatus(undefined)).toBeUndefined();
    });

    it('should throw for invalid HTTP status codes', () => {
      expect(() => getCommunicationStatus(100)).toThrow('httpStatus 100 is not a supported CommunicationStatus.');
      expect(() => getCommunicationStatus(199)).toThrow('httpStatus 199 is not a supported CommunicationStatus.');
      expect(() => getCommunicationStatus(600)).toThrow('httpStatus 600 is not a supported CommunicationStatus.');
      expect(() => getCommunicationStatus(-1)).toThrow('httpStatus -1 is not a supported CommunicationStatus.');
    });

    it('should throw for invalid status strings', () => {
      expect(() => getCommunicationStatus('invalid' as any)).toThrow('invalid is not a valid CommunicationStatus.');
      expect(() => getCommunicationStatus('' as any)).toThrow(' is not a valid CommunicationStatus.');
      expect(() => getCommunicationStatus('notAStatus' as any)).toThrow('notAStatus is not a valid CommunicationStatus.');
    });
  });

  describe('getCommunicationStatusFromHttpStatusOrUndefined', () => {
    it('should return the correct status for valid HTTP status codes', () => {
      expect(getCommunicationStatusFromHttpStatusOrUndefined(200)).toBe(success);
      expect(getCommunicationStatusFromHttpStatusOrUndefined(404)).toBe(missing);
      expect(getCommunicationStatusFromHttpStatusOrUndefined(400)).toBe(clientFailure);
      expect(getCommunicationStatusFromHttpStatusOrUndefined(401)).toBe(clientFailureNotAuthorized);
      expect(getCommunicationStatusFromHttpStatusOrUndefined(500)).toBe(serverFailure);
      expect(getCommunicationStatusFromHttpStatusOrUndefined(502)).toBe(networkFailure);
    });

    it('should return undefined for invalid HTTP status codes', () => {
      expect(getCommunicationStatusFromHttpStatusOrUndefined(100)).toBeUndefined();
      expect(getCommunicationStatusFromHttpStatusOrUndefined(199)).toBeUndefined();
      expect(getCommunicationStatusFromHttpStatusOrUndefined(600)).toBeUndefined();
      expect(getCommunicationStatusFromHttpStatusOrUndefined(-1)).toBeUndefined();
    });
  });

  describe('getCommunicationStatusOrUndefined', () => {
    it('should return the correct status for valid HTTP status codes', () => {
      expect(getCommunicationStatusOrUndefined(200)).toBe(success);
      expect(getCommunicationStatusOrUndefined(404)).toBe(missing);
      expect(getCommunicationStatusOrUndefined(400)).toBe(clientFailure);
      expect(getCommunicationStatusOrUndefined(401)).toBe(clientFailureNotAuthorized);
      expect(getCommunicationStatusOrUndefined(500)).toBe(serverFailure);
      expect(getCommunicationStatusOrUndefined(502)).toBe(networkFailure);
    });

    it('should return the correct status for valid status strings', () => {
      expect(getCommunicationStatusOrUndefined(success)).toBe(success);
      expect(getCommunicationStatusOrUndefined(missing)).toBe(missing);
      expect(getCommunicationStatusOrUndefined(clientFailure)).toBe(clientFailure);
      expect(getCommunicationStatusOrUndefined(serverFailure)).toBe(serverFailure);
      expect(getCommunicationStatusOrUndefined(networkFailure)).toBe(networkFailure);
    });

    it('should return undefined for null and undefined inputs', () => {
      expect(getCommunicationStatusOrUndefined(null)).toBeUndefined();
      expect(getCommunicationStatusOrUndefined(undefined)).toBeUndefined();
    });

    it('should return undefined for invalid HTTP status codes', () => {
      expect(getCommunicationStatusOrUndefined(100)).toBeUndefined();
      expect(getCommunicationStatusOrUndefined(199)).toBeUndefined();
      expect(getCommunicationStatusOrUndefined(600)).toBeUndefined();
      expect(getCommunicationStatusOrUndefined(-1)).toBeUndefined();
    });

    it('should return undefined for invalid status strings', () => {
      expect(getCommunicationStatusOrUndefined('invalid' as any)).toBeUndefined();
      expect(getCommunicationStatusOrUndefined('' as any)).toBeUndefined();
      expect(getCommunicationStatusOrUndefined('notAStatus' as any)).toBeUndefined();
    });
  });

  describe('getCommunicationStatusDetails', () => {
    it('should handle successful responses', () => {
      expect(getCommunicationStatusDetails(200)).toEqual({
        status: success,
        httpStatus: 200,
        message: 'success (200)'
      });
      expect(getCommunicationStatusDetails(201)).toEqual({
        status: success,
        httpStatus: 201,
        message: 'success (201)'
      });
    });

    it('should handle missing resources', () => {
      expect(getCommunicationStatusDetails(404)).toEqual({
        status: missing,
        httpStatus: 404,
        message: 'missing (404)'
      });
      expect(getCommunicationStatusDetails(501)).toEqual({
        status: missing,
        httpStatus: 501,
        message: 'missing (501)'
      });
      expect(getCommunicationStatusDetails(301)).toEqual({
        status: missing,
        httpStatus: 301,
        message: 'missing (301)'
      });
      expect(getCommunicationStatusDetails(302)).toEqual({
        status: missing,
        httpStatus: 302,
        message: 'missing (302)'
      });
      expect(getCommunicationStatusDetails(307)).toEqual({
        status: missing,
        httpStatus: 307,
        message: 'missing (307)'
      });
      expect(getCommunicationStatusDetails(308)).toEqual({
        status: missing,
        httpStatus: 308,
        message: 'missing (308)'
      });
    });

    it('should handle client failures', () => {
      expect(getCommunicationStatusDetails(400)).toEqual({
        status: clientFailure,
        httpStatus: 400,
        message: 'clientFailure (400)'
      });
      expect(getCommunicationStatusDetails(505)).toEqual({
        status: clientFailure,
        httpStatus: 505,
        message: 'clientFailure (505)'
      });
      expect(getCommunicationStatusDetails(530)).toEqual({
        status: clientFailure,
        httpStatus: 530,
        message: 'clientFailure (530)'
      });
    });

    it('should handle authorization failures', () => {
      expect(getCommunicationStatusDetails(401)).toEqual({
        status: clientFailureNotAuthorized,
        httpStatus: 401,
        message: 'clientFailureNotAuthorized (401)'
      });
      expect(getCommunicationStatusDetails(403)).toEqual({
        status: clientFailureNotAuthorized,
        httpStatus: 403,
        message: 'clientFailureNotAuthorized (403)'
      });
      expect(getCommunicationStatusDetails(511)).toEqual({
        status: clientFailureNotAuthorized,
        httpStatus: 511,
        message: 'clientFailureNotAuthorized (511)'
      });
    });

    it('should handle server failures', () => {
      expect(getCommunicationStatusDetails(500)).toEqual({
        status: serverFailure,
        httpStatus: 500,
        message: 'serverFailure (500)'
      });
    });

    it('should handle network failures', () => {
      expect(getCommunicationStatusDetails(undefined)).toEqual({
        status: networkFailure,
        message: 'network failure'
      });
      expect(getCommunicationStatusDetails(502)).toEqual({
        status: networkFailure,
        httpStatus: 502,
        message: 'networkFailure (502)'
      });
    });

    it('should throw for unsupported HTTP status codes', () => {
      expect(() => getCommunicationStatusDetails(100)).toThrow();
    });
  });

  describe('getHttpStatus', () => {
    it('should return correct HTTP status codes', () => {
      expect(getHttpStatus(success)).toBe(200);
      expect(getHttpStatus(missing)).toBe(404);
      expect(getHttpStatus(clientFailure)).toBe(400);
      expect(getHttpStatus(serverFailure)).toBe(500);
    });

    it('should throw for statuses without HTTP equivalents', () => {
      expect(() => getHttpStatus(networkFailure)).toThrow();
      expect(() => getHttpStatus(pending)).toThrow();
      expect(() => getHttpStatus(aborted)).toThrow();
    });
  });
});
