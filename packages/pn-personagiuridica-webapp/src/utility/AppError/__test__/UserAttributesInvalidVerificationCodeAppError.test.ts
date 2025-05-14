import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { UserAttributesInvalidVerificationCodeAppError } from '../UserAttributesInvalidVerificationCodeAppError';
import { ServerResponseErrorCode } from '../types';

describe('Test UserAttributesInvalidVerificationCodeAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return invalid verification code message', () => {
    const appError = new UserAttributesInvalidVerificationCodeAppError(
      {
        code: ServerResponseErrorCode.PN_USERATTRIBUTES_INVALIDVERIFICATIONCODE,
      } as ServerResponseError,
      translateFn
    );
    const message = appError.getMessage();
    expect(message.title).toBe('errors.invalid_verification_code.title recapiti');
    expect(message.content).toBe('errors.invalid_verification_code.message recapiti');
  });

  it('Should return limit is exceeded code message', () => {
    const appError = new UserAttributesInvalidVerificationCodeAppError(
      {
        code: ServerResponseErrorCode.PN_USERATTRIBUTES_RETRYLIMITVERIFICATIONCODE,
      } as ServerResponseError,
      translateFn
    );
    const message = appError.getMessage();
    expect(message.title).toBe('errors.retry_limit_code.title recapiti');
    expect(message.content).toBe('errors.retry_limit_code.message recapiti');
  });

  it('Should return expired verification code message', () => {
    const appError = new UserAttributesInvalidVerificationCodeAppError(
      {
        code: ServerResponseErrorCode.PN_USERATTRIBUTES_EXPIREDVERIFICATIONCODE,
      } as ServerResponseError,
      translateFn
    );
    const message = appError.getMessage();
    expect(message.title).toBe('errors.expired_verification_code.title recapiti');
    expect(message.content).toBe('errors.expired_verification_code.message recapiti');
  });

  it('Should return unknown code message', () => {
    const appError = new UserAttributesInvalidVerificationCodeAppError(
      {
        code: 'fake' as ServerResponseErrorCode,
      } as ServerResponseError,
      translateFn
    );
    const message = appError.getMessage();
    expect(message.title).toBe('errors.unknown.title common');
    expect(message.content).toBe('errors.unknown.message common');
  });
});
