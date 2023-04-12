import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { GenericInvalidParameterDuplicateAppError } from '../GenericInvalidParameterDuplicateAppError';

describe('Test GenericInvalidParameterDuplicateAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return invalid parameter message', () => {
    const appError = new GenericInvalidParameterDuplicateAppError(
      {} as ServerResponseError,
      translateFn
    );
    const messege = appError.getMessage();
    expect(messege.title).toBe('new-notification.errors.invalid_parameter.title notifiche');
    expect(messege.content).toBe('new-notification.errors.invalid_parameter.message notifiche');
  });

  it('Should return duplicated protocol number message', () => {
    const appError = new GenericInvalidParameterDuplicateAppError(
      {
        element: 'Duplicated notification for senderPaId##paProtocolNumber##idempotenceToken',
      } as ServerResponseError,
      translateFn
    );
    const messege = appError.getMessage();
    expect(messege.title).toBe(
      'new-notification.errors.invalid_parameter_protocol_number_duplicate.title notifiche'
    );
    expect(messege.content).toBe(
      'new-notification.errors.invalid_parameter_protocol_number_duplicate.message notifiche'
    );
  });
});
