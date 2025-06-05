import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { DeliveryNotificationWithoutPaymentAttachmentAppError } from '../DeliveryNotificationWithoutPaymentAttachmentAppError';

describe('Test DeliveryNotificationWithoutPaymentAttachmentAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return file info not found message', () => {
    const appError = new DeliveryNotificationWithoutPaymentAttachmentAppError(
      {} as ServerResponseError,
      translateFn
    );
    const message = appError.getMessage();
    expect(message.title).toBe(
      'detail.errors.delivery_notification_without_payment_attachment.title notifiche'
    );
    expect(message.content).toBe(
      'detail.errors.delivery_notification_without_payment_attachment.message notifiche'
    );
  });

  it('getResponseError includes showTechnicalData = true and message', () => {
    const serverError = {
      code: 'error-code',
      detail: 'error-detail',
      element: 'error-element',
    } as ServerResponseError;

    const appError = new DeliveryNotificationWithoutPaymentAttachmentAppError(
      serverError,
      translateFn
    );

    expect(appError.getResponseError()).toStrictEqual({
      code: 'error-code',
      detail: 'error-detail',
      element: 'error-element',
      showTechnicalData: true,
      message: {
        title: 'detail.errors.delivery_notification_without_payment_attachment.title notifiche',
        content: 'detail.errors.delivery_notification_without_payment_attachment.message notifiche',
      },
    });
  });
});
