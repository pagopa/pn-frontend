import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

export class DeliveryNotificationLimitExceededAppError extends AppError {
  private readonly translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    return {
      title: this.translateFunction(
        'new-notification.errors.delivery_notification_limit_exceeded.title',
        'notifiche'
      ),
      content: this.translateFunction(
        'new-notification.errors.delivery_notification_limit_exceeded.message',
        'notifiche'
      ),
    };
  }
}
