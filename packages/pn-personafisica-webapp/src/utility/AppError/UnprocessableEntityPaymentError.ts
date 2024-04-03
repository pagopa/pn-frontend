import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

export class UnprocessableEntityPaymentError extends AppError {
  private translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    return {
      title: this.translateFunction('errors.payment.unprocessable_entity.title', 'notifiche'),
      content: this.translateFunction('errors.payment.unprocessable_entity.message', 'notifiche'),
    };
  }
}
