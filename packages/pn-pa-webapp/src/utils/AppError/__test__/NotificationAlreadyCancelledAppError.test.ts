import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { NotificationAlreadyCancelledAppError } from '../NotificationAlreadyCancelledAppError';

describe('Test NotificationAlreadyCancelledAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return invalid parameter message', () => {
    const appError = new NotificationAlreadyCancelledAppError(
      {} as ServerResponseError,
      translateFn
    );
    const messege = appError.getMessage();
    // controllo fatto con uno spazio perchè considera anche da quale locales prendere il messaggio
    expect(messege.title).toBe(' ');
    expect(messege.content).toBe('detail.errors.already_cancelled.message notifiche');
  });
});
