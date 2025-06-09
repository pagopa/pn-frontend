import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

export class DeliveryMandateNotFoundAppError extends AppError {
  private translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    return {
      title: this.translateFunction('errors.delivery_mandate_not_found.title', 'common'),
      content: this.translateFunction('errors.delivery_mandate_not_found.message', 'common'),
    };
  }
}
