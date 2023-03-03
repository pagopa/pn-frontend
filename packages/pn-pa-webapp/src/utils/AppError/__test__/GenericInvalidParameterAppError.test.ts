import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { GenericInvalidParameterAppError } from '../GenericInvalidParameterAppError';

describe('Test GenericInvalidParameterAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return invalid parameter message', () => {
    const appError = new GenericInvalidParameterAppError({} as ServerResponseError, translateFn);
    const messege = appError.getMessage();
    expect(messege.title).toBe('new-notification.errors.invalid_parameter.title notifiche');
    expect(messege.content).toBe('new-notification.errors.invalid_parameter.message notifiche');
  });

  it('Should return invalid fiscal code message', () => {
    const appError = new GenericInvalidParameterAppError(
      { detail: 'Invalid taxId for recipient' } as ServerResponseError,
      translateFn
    );
    const messege = appError.getMessage();
    expect(messege.title).toBe('new-notification.errors.fiscal_code.title notifiche');
    expect(messege.content).toBe('new-notification.errors.fiscal_code.message notifiche');
  });
});
