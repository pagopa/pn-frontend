import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { MandateAlreadyExistsAppError } from '../MandateAlreadyExistsAppError';

describe('Test MandateAlreadyExistsAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return already exists message', () => {
    const appError = new MandateAlreadyExistsAppError({} as ServerResponseError, translateFn);
    const messege = appError.getMessage();
    expect(messege.title).toBe('errors.already_exists.title deleghe');
    expect(messege.content).toBe('errors.already_exists.message deleghe');
  });
});
