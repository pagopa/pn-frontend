import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { MandateNotAcceptableAppError } from '../MandateNotAcceptableAppError';

describe('Test MandateNotAcceptableAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return not acceptable message', () => {
    const appError = new MandateNotAcceptableAppError({} as ServerResponseError, translateFn);
    const messege = appError.getMessage();
    expect(messege.title).toBe('errors.not_acceptable.title deleghe');
    expect(messege.content).toBe('errors.not_acceptable.message deleghe');
  });
});
