import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

export class GenericNotificationCancelledAppError extends AppError {
  private translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    return {
      title: this.translateFunction('', ''),
      content: this.translateFunction(
        'cancelled-notification.errors.generic_error.message',
        'notifiche'
      ),
    };
  }
}
