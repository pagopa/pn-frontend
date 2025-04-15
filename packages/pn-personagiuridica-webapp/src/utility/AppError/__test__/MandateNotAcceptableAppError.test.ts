import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { MandateNotAcceptableAppError } from '../MandateNotAcceptableAppError';

describe('Test MandateNotAcceptableAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return not acceptable message', () => {
    const appError = new MandateNotAcceptableAppError({} as ServerResponseError, translateFn);
    const message = appError.getMessage();
    expect(message.title).toBe('errors.not_acceptable.title deleghe');
    expect(message.content).toBe('errors.not_acceptable.message deleghe');
  });
});
