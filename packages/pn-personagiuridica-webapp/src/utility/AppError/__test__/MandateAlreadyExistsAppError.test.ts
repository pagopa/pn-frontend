import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { MandateAlreadyExistsAppError } from '../MandateAlreadyExistsAppError';

describe('Test MandateAlreadyExistsAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return already exists message', () => {
    const appError = new MandateAlreadyExistsAppError({} as ServerResponseError, translateFn);
    const message = appError.getMessage();
    expect(message.title).toBe('errors.already_exists.title deleghe');
    expect(message.content).toBe('errors.already_exists.message deleghe');
  });
});
