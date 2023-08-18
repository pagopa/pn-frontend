import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { GenericNotificationCancelledAppError } from '../GenericNotificationCancelledAppError';

describe('Test GenericNotificationCancelledAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return invalid parameter message', () => {
    const appError = new GenericNotificationCancelledAppError(
      {} as ServerResponseError,
      translateFn
    );
    const messege = appError.getMessage();
    // controllo fatto con uno spazio perchè considera anche da quale locales prendere il messaggio
    expect(messege.title).toBe(' ');
    expect(messege.content).toBe('cancelled-notification.errors.generic_error.message notifiche');
  });
});
