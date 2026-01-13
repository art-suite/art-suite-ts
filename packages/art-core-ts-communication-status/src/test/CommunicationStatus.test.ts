import { describe, expect, it } from 'vitest';
import {
  aborted,
  clientFailure,
  clientFailureNotAuthorized,
  CommunicationStatus,
  communicationStatuses,
  failure,
  getCommunicationStatus,
  getCommunicationStatusDetails,
  getCommunicationStatusDetailsOrUndefined,
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
  timeoutFailure,
  UnknownCommunicationStatusDetails
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
      expect(getCommunicationStatusDetails(200)).toEqual(communicationStatuses.success);
      expect(getCommunicationStatusDetails(201)).toEqual(communicationStatuses.success);
    });

    it('should handle missing resources', () => {
      expect(getCommunicationStatusDetails(404)).toEqual(communicationStatuses.missing);
      expect(getCommunicationStatusDetails(501)).toEqual(communicationStatuses.missing);
      expect(getCommunicationStatusDetails(301)).toEqual(communicationStatuses.missing);
      expect(getCommunicationStatusDetails(302)).toEqual(communicationStatuses.missing);
      expect(getCommunicationStatusDetails(307)).toEqual(communicationStatuses.missing);
      expect(getCommunicationStatusDetails(308)).toEqual(communicationStatuses.missing);
    });

    it('should handle client failures', () => {
      expect(getCommunicationStatusDetails(400)).toEqual(communicationStatuses.clientFailure);
      expect(getCommunicationStatusDetails(505)).toEqual(communicationStatuses.clientFailure);
      expect(getCommunicationStatusDetails(530)).toEqual(communicationStatuses.clientFailure);
    });

    it('should handle authorization failures', () => {
      expect(getCommunicationStatusDetails(401)).toEqual(communicationStatuses.clientFailureNotAuthorized);
      expect(getCommunicationStatusDetails(403)).toEqual(communicationStatuses.clientFailureNotAuthorized);
      expect(getCommunicationStatusDetails(511)).toEqual(communicationStatuses.clientFailureNotAuthorized);
    });

    it('should handle server failures', () => {
      expect(getCommunicationStatusDetails(500)).toEqual(communicationStatuses.serverFailure);
    });

    it('should handle network failures', () => {
      expect(getCommunicationStatusDetails(undefined)).toEqual(undefined);
      expect(getCommunicationStatusDetails(502)).toEqual(communicationStatuses.networkFailure);
    });

    it('should return UnknownCommunicationStatusDetails for unsupported HTTP status codes', () => {
      const result = getCommunicationStatusDetails(100);
      expect(result).toEqual({
        status: 'unknown',
        communicationStatus: 'unknown',
        message: 'Unknown communication status',
        failure: true
      });
    });

    describe('never fails - comprehensive edge case testing', () => {
      it('should handle null and undefined gracefully', () => {
        expect(getCommunicationStatusDetails(null)).toBeUndefined();
        expect(getCommunicationStatusDetails(undefined)).toBeUndefined();
      });

      it('should handle valid communication status strings', () => {
        expect(getCommunicationStatusDetails('success')).toEqual(communicationStatuses.success);
        expect(getCommunicationStatusDetails('pending')).toEqual(communicationStatuses.pending);
        expect(getCommunicationStatusDetails('networkFailure')).toEqual(communicationStatuses.networkFailure);
        expect(getCommunicationStatusDetails('aborted')).toEqual(communicationStatuses.aborted);
        expect(getCommunicationStatusDetails('timeoutFailure')).toEqual(communicationStatuses.timeoutFailure);
        expect(getCommunicationStatusDetails('disabled')).toEqual(communicationStatuses.disabled);
      });

      it('should handle all valid HTTP status codes without throwing', () => {
        // 2xx success codes
        expect(() => getCommunicationStatusDetails(200)).not.toThrow();
        expect(() => getCommunicationStatusDetails(201)).not.toThrow();
        expect(() => getCommunicationStatusDetails(202)).not.toThrow();
        expect(() => getCommunicationStatusDetails(204)).not.toThrow();
        expect(() => getCommunicationStatusDetails(299)).not.toThrow();

        // 3xx redirect codes (mapped to missing)
        expect(() => getCommunicationStatusDetails(300)).not.toThrow();
        expect(() => getCommunicationStatusDetails(301)).not.toThrow();
        expect(() => getCommunicationStatusDetails(302)).not.toThrow();
        expect(() => getCommunicationStatusDetails(304)).not.toThrow();
        expect(() => getCommunicationStatusDetails(399)).not.toThrow();

        // 4xx client error codes
        expect(() => getCommunicationStatusDetails(400)).not.toThrow();
        expect(() => getCommunicationStatusDetails(401)).not.toThrow();
        expect(() => getCommunicationStatusDetails(403)).not.toThrow();
        expect(() => getCommunicationStatusDetails(404)).not.toThrow();
        expect(() => getCommunicationStatusDetails(407)).not.toThrow();
        expect(() => getCommunicationStatusDetails(409)).not.toThrow();
        expect(() => getCommunicationStatusDetails(422)).not.toThrow();
        expect(() => getCommunicationStatusDetails(451)).not.toThrow();
        expect(() => getCommunicationStatusDetails(499)).not.toThrow();

        // 5xx server error codes
        expect(() => getCommunicationStatusDetails(500)).not.toThrow();
        expect(() => getCommunicationStatusDetails(501)).not.toThrow();
        expect(() => getCommunicationStatusDetails(502)).not.toThrow();
        expect(() => getCommunicationStatusDetails(503)).not.toThrow();
        expect(() => getCommunicationStatusDetails(504)).not.toThrow();
        expect(() => getCommunicationStatusDetails(505)).not.toThrow();
        expect(() => getCommunicationStatusDetails(511)).not.toThrow();
        expect(() => getCommunicationStatusDetails(530)).not.toThrow();
        expect(() => getCommunicationStatusDetails(599)).not.toThrow();

        // Special case: 0 (disabled)
        expect(() => getCommunicationStatusDetails(0)).not.toThrow();
        expect(getCommunicationStatusDetails(0)).toEqual(communicationStatuses.disabled);
      });

      it('should handle extreme numeric values gracefully', () => {
        // Should return UnknownCommunicationStatusDetails for invalid numeric inputs
        expect(getCommunicationStatusDetails(-1)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails(99)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails(100)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails(199)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails(600)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails(999)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails(1000)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails(Number.MAX_SAFE_INTEGER)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails(Number.MIN_SAFE_INTEGER)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails(Infinity)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails(-Infinity)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails(NaN)).toEqual(UnknownCommunicationStatusDetails);
      });

      it('should handle invalid string inputs gracefully', () => {
        // Should return UnknownCommunicationStatusDetails for invalid string inputs
        expect(getCommunicationStatusDetails('' as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails('invalid' as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails('notAStatus' as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails('Success' as any)).toEqual(UnknownCommunicationStatusDetails); // case sensitive
        expect(getCommunicationStatusDetails('SUCCESS' as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails('client_failure' as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails('client-failure' as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails('200' as any)).toEqual(UnknownCommunicationStatusDetails); // string number
      });

      it('should handle non-primitive types gracefully', () => {
        // Should return UnknownCommunicationStatusDetails for non-primitive types
        expect(getCommunicationStatusDetails({} as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails([] as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails(true as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails(false as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails(Symbol('test') as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails((() => { }) as any)).toEqual(UnknownCommunicationStatusDetails);
      });

      it('should handle edge case objects that might be passed', () => {
        // Should return UnknownCommunicationStatusDetails for complex objects
        expect(getCommunicationStatusDetails({ httpStatus: 200 } as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails({ status: 'success' } as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails(new Date() as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails(new Error('test') as any)).toEqual(UnknownCommunicationStatusDetails);
      });

      it('should always return a valid CommunicationStatusDetails object for valid inputs', () => {
        const validInputs = [
          200, 404, 500, 0,
          'success', 'pending', 'networkFailure', 'aborted'
        ];

        validInputs.forEach(input => {
          const result = getCommunicationStatusDetails(input as number | CommunicationStatus);
          expect(result).toBeDefined();
          expect(typeof result).toBe('object');
          expect(result).toHaveProperty('status');
          expect(result).toHaveProperty('communicationStatus');
          expect(result).toHaveProperty('message');
          expect(typeof result.status).toBe('string');
          expect(typeof result.communicationStatus).toBe('string');
          expect(typeof result.message).toBe('string');
        });
      });

      it('should return undefined for null/undefined inputs', () => {
        expect(getCommunicationStatusDetails(null)).toBeUndefined();
        expect(getCommunicationStatusDetails(undefined)).toBeUndefined();
      });

      it('should never throw errors regardless of input type', () => {
        const crazyInputs = [
          // Primitives
          '', 'invalid', 'Success', 'NULL', 'undefined',
          0, -1, 99, 100, 199, 600, 999, 1000,
          Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER,
          Infinity, -Infinity, NaN,
          true, false,

          // Objects and arrays
          {}, [], { httpStatus: 200 }, { status: 'success' },
          [200], ['success'], [null], [undefined],

          // Functions and symbols
          (() => { }), (function namedFunc() { }), Symbol('test'), Symbol.for('test'),

          // Date and Error objects
          new Date(), new Error('test'), new TypeError('test'),

          // Weird edge cases
          Object.create(null), new Map(), new Set(), new WeakMap(), new WeakSet(),
          /regex/, new RegExp('test'),

          // Proxy objects (if supported)
          ...(typeof Proxy !== 'undefined' ? [new Proxy({}, {})] : []),
        ];

        crazyInputs.forEach((input, index) => {
          expect(() => {
            const result = getCommunicationStatusDetails(input as any);
            // Should either return UnknownCommunicationStatusDetails or undefined (for null-like inputs)
            expect(result === UnknownCommunicationStatusDetails || result === undefined).toBe(true);
          }).not.toThrow(`Input at index ${index}: ${typeof input === 'object' ? Object.prototype.toString.call(input) : String(input)}`);
        });
      });

      it('should handle floating point numbers', () => {
        // Note: Floating point numbers are handled by Math.floor() in the outer switch,
        // but the inner switch compares the exact floating point value
        // So 200.5 maps to 2xx (success) since Math.floor(200.5/100) = 2
        expect(getCommunicationStatusDetails(200.5)).toEqual(communicationStatuses.success);
        // But 404.1 !== 404 in the inner switch, so it falls to default (clientFailure)
        expect(getCommunicationStatusDetails(404.1)).toEqual(communicationStatuses.clientFailure);
        expect(getCommunicationStatusDetails(400.9)).toEqual(communicationStatuses.clientFailure);
        // Non-HTTP-like floating points should return unknown
        expect(getCommunicationStatusDetails(3.14159)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails(99.9)).toEqual(UnknownCommunicationStatusDetails);
      });

      it('should handle string representations of valid numbers', () => {
        expect(getCommunicationStatusDetails('200' as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails('404' as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails('0' as any)).toEqual(UnknownCommunicationStatusDetails);
      });

      it('should handle whitespace and special characters in strings', () => {
        expect(getCommunicationStatusDetails(' success ' as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails('\nsuccess\n' as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails('\tsuccess\t' as any)).toEqual(UnknownCommunicationStatusDetails);
        expect(getCommunicationStatusDetails('success\0' as any)).toEqual(UnknownCommunicationStatusDetails);
      });

      it('should maintain consistent return type structure for all valid inputs', () => {
        const validInputs = [
          // Valid HTTP codes
          200, 201, 204, 301, 404, 400, 401, 403, 500, 502, 0,
          // Valid status strings
          'success', 'pending', 'networkFailure', 'aborted', 'timeoutFailure', 'disabled',
          'missing', 'clientFailure', 'clientFailureNotAuthorized', 'serverFailure', 'failure'
        ];

        validInputs.forEach(input => {
          const result = getCommunicationStatusDetails(input as number | CommunicationStatus);
          expect(result).toBeDefined();
          expect(typeof result).toBe('object');
          expect(result).toHaveProperty('status');
          expect(result).toHaveProperty('communicationStatus');
          expect(result).toHaveProperty('message');
          expect(result).toHaveProperty('failure');
          expect(typeof result.status).toBe('string');
          expect(typeof result.communicationStatus).toBe('string');
          expect(typeof result.message).toBe('string');
          expect(typeof result.failure).toBe('boolean');
          // httpStatus can be number or undefined
          if (result.httpStatus !== undefined) {
            expect(typeof result.httpStatus).toBe('number');
          }
        });
      });

      it('should handle rapid successive calls without issues', () => {
        // Test for any potential state issues or memory leaks
        for (let i = 0; i < 1000; i++) {
          expect(() => getCommunicationStatusDetails(200)).not.toThrow();
          expect(() => getCommunicationStatusDetails('invalid' as any)).not.toThrow();
          expect(() => getCommunicationStatusDetails(null)).not.toThrow();
        }
      });
    });
  });

  describe('getCommunicationStatusDetailsOrUndefined', () => {
    it('should return details for valid communication statuses', () => {
      expect(getCommunicationStatusDetailsOrUndefined(aborted)).toEqual(communicationStatuses.aborted);
      expect(getCommunicationStatusDetailsOrUndefined(success)).toEqual(communicationStatuses.success);
      expect(getCommunicationStatusDetailsOrUndefined(networkFailure)).toEqual(communicationStatuses.networkFailure);
    });

    it('should return details for valid HTTP status codes', () => {
      expect(getCommunicationStatusDetailsOrUndefined(200)).toEqual(communicationStatuses.success);
      expect(getCommunicationStatusDetailsOrUndefined(404)).toEqual(communicationStatuses.missing);
    });

    it('should return undefined for null and undefined inputs', () => {
      expect(getCommunicationStatusDetailsOrUndefined(null)).toBeUndefined();
      expect(getCommunicationStatusDetailsOrUndefined(undefined)).toBeUndefined();
    });

    it('should return undefined for invalid status strings', () => {
      expect(getCommunicationStatusDetailsOrUndefined('invalid' as any)).toBeUndefined();
      expect(getCommunicationStatusDetailsOrUndefined('' as any)).toBeUndefined();
    });

    it('should return undefined for invalid HTTP status codes', () => {
      expect(getCommunicationStatusDetailsOrUndefined(100)).toBeUndefined();
      expect(getCommunicationStatusDetailsOrUndefined(600)).toBeUndefined();
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
