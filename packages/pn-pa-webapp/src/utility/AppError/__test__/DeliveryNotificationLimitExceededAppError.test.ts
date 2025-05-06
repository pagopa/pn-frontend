import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { DeliveryNotificationLimitExceededAppError } from '../DeliveryNotificationLimitExceededAppError';

describe('Test DeliveryNotificationLimitExceededAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return notification limit exceeded message', () => {
    const appError = new DeliveryNotificationLimitExceededAppError(
      {} as ServerResponseError,
      translateFn
    );
    const message = appError.getMessage();
    expect(message.title).toBe(
      'new-notification.errors.delivery_notification_limit_exceeded.title notifiche'
    );
    expect(message.content).toBe(
      'new-notification.errors.delivery_notification_limit_exceeded.message notifiche'
    );
  });
});
