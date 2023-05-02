import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { UserAttributesInvalidVerificationCodeAppError } from '../UserAttributesInvalidVerificationCodeAppError';
import {ServerResponseErrorCode} from "../types";

describe('Test UserAttributesInvalidVerificationCodeAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return invalid verification code message', () => {
    const appError = new UserAttributesInvalidVerificationCodeAppError(
      {
        code: ServerResponseErrorCode.PN_USERATTRIBUTES_INVALIDVERIFICATIONCODE
      } as ServerResponseError,
      translateFn
    );
    const messege = appError.getMessage();
    expect(messege.title).toBe('errors.invalid_verification_code.title recapiti');
    expect(messege.content).toBe('errors.invalid_verification_code.message recapiti');
  });
});
