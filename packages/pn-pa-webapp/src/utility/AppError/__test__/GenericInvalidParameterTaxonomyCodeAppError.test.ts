import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { GenericInvalidParameterTaxonomyCodeAppError } from '../GenericInvalidParameterTaxonomyCodeAppError';

describe('Test GenericInvalidParameterAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return invalid parameter message', () => {
    const appError = new GenericInvalidParameterTaxonomyCodeAppError({} as ServerResponseError, translateFn);
    const messege = appError.getMessage();
    expect(messege.title).toBe('new-notification.errors.invalid_parameter_taxonomy_code.title notifiche');
    expect(messege.content).toBe('new-notification.errors.invalid_parameter_taxonomy_code.message notifiche');
  });
});
