import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { UserAttributesInvalidVerificationCodeAppError } from '../UserAttributesInvalidVerificationCodeAppError';

describe('Test UserAttributesInvalidVerificationCodeAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return invalid verification code message', () => {
    const appError = new UserAttributesInvalidVerificationCodeAppError(
      {} as ServerResponseError,
      translateFn
    );
    const messege = appError.getMessage();
    expect(messege.title).toBe('errors.invalid_verification_code.title recapiti');
    expect(messege.content).toBe('errors.invalid_verification_code.message recapiti');
  });
});
