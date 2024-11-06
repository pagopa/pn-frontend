import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { InvalidBodyAppError } from '../InvalidBodyAppError';

describe('Test InvalidBodyAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return not found message', () => {
    const appError = new InvalidBodyAppError({} as ServerResponseError, translateFn);
    const messege = appError.getMessage();
    expect(messege.title).toBe('errors.invalid_body.title common');
    expect(messege.content).toBe('errors.invalid_body.message common');
  });
});