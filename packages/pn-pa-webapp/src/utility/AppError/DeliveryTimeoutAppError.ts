import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

export class DeliveryTimeoutAppError extends AppError {
  private readonly translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error, true);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    return {
      title: this.translateFunction('detail.errors.delivery_timeout.title', 'notifiche'),
      content: this.translateFunction('detail.errors.delivery_timeout.message', 'notifiche'),
    };
  }
}
