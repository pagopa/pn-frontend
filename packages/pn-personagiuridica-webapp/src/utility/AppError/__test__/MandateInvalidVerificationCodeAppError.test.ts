import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { MandateInvalidVerificationCodeAppError } from '../MandateInvalidVerificationCodeAppError';

describe('Test MandateInvalidVerificationCodeAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return invalid verification code message', () => {
    const appError = new MandateInvalidVerificationCodeAppError(
      {} as ServerResponseError,
      translateFn
    );
    const message = appError.getMessage();
    expect(message.title).toBe('errors.invalid_verification_code.title deleghe');
    expect(message.content).toBe('errors.invalid_verification_code.message deleghe');
  });
});
