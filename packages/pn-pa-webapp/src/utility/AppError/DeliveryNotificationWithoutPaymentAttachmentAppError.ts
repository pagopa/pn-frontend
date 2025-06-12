import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

export class DeliveryNotificationWithoutPaymentAttachmentAppError extends AppError {
  private readonly translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error, true);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    return {
      title: this.translateFunction('detail.errors.delivery_notification_without_payment_attachment.title', 'notifiche'),
      content: this.translateFunction(
        'detail.errors.delivery_notification_without_payment_attachment.message',
        'notifiche'
      ),
    };
  }
}