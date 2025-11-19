import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { GenericInvalidParameterDuplicateAppError } from '../GenericInvalidParameterDuplicateAppError';

describe('Test GenericInvalidParameterDuplicateAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return invalid parameter message', () => {
    const appError = new GenericInvalidParameterDuplicateAppError(
      {} as ServerResponseError,
      translateFn
    );
    const message = appError.getMessage();
    expect(message.title).toBe('new-notification.errors.invalid_parameter.title notifiche');
    expect(message.content).toBe('new-notification.errors.invalid_parameter.message notifiche');
  });

  it('Should return duplicated protocol number message', () => {
    const appError = new GenericInvalidParameterDuplicateAppError(
      {
        element: 'Duplicated notification for senderPaId##paProtocolNumber##idempotenceToken',
      } as ServerResponseError,
      translateFn
    );
    const message = appError.getMessage();
    expect(message.title).toBe(
      'new-notification.errors.invalid_parameter_protocol_number_duplicate.title notifiche'
    );
    expect(message.content).toBe(
      'new-notification.errors.invalid_parameter_protocol_number_duplicate.message notifiche'
    );
  });

  it('Should return duplicated notice code message', () => {
    const appError = new GenericInvalidParameterDuplicateAppError(
      {
        element: 'Duplicated notification for creditorTaxId##noticeCode',
      } as ServerResponseError,
      translateFn
    );
    const message = appError.getMessage();
    expect(message.title).toBe(
      'new-notification.errors.invalid_parameter_notice_code_duplicate.title notifiche'
    );
    expect(message.content).toBe(
      'new-notification.errors.invalid_parameter_notice_code_duplicate.message notifiche'
    );
  });
});
