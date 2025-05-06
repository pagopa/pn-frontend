import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { MandateDelegateHimselfAppError } from '../MandateDelegateHimselfAppError';

describe('Test MandateDelegateHimselfAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return delegate himself message', () => {
    const appError = new MandateDelegateHimselfAppError({} as ServerResponseError, translateFn);
    const message = appError.getMessage();
    expect(message.title).toBe('errors.delegate_himself.title deleghe');
    expect(message.content).toBe('errors.delegate_himself.message deleghe');
  });
});
