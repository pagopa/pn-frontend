import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

export class NotificationAlreadyCancelledAppError extends AppError {
  private translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    return {
      title: this.translateFunction('', ''),
      content: this.translateFunction(
        'cancelled-notification.errors.already_cancelled.message',
        'notifiche'
      ),
    };
  }
}
