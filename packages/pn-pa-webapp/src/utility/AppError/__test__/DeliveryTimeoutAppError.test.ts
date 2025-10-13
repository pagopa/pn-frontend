import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { DeliveryTimeoutAppError } from '../DeliveryTimeoutAppError';

describe('Test DeliveryTimeoutAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return timeout message', () => {
    const appError = new DeliveryTimeoutAppError({} as ServerResponseError, translateFn);
    const message = appError.getMessage();
    expect(message.title).toBe('detail.errors.delivery_timeout.title notifiche');
    expect(message.content).toBe('detail.errors.delivery_timeout.message notifiche');
  });
});
