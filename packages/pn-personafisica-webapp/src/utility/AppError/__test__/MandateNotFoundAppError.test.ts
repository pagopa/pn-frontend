import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { MandateNotFoundAppError } from '../MandateNotFoundAppError';

describe('Test MandateNotFoundAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return not found message', () => {
    const appError = new MandateNotFoundAppError({} as ServerResponseError, translateFn);
    const message = appError.getMessage();
    expect(message.title).toBe('errors.not_found.title deleghe');
    expect(message.content).toBe('errors.not_found.message deleghe');
  });
});
