import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

export class DeliveryFileInfoNotFoundAppError extends AppError {
  private translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error, true);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    return {
      title: this.translateFunction('detail.errors.delivery_file_info_not_found.title', 'notifiche'),
      content: this.translateFunction('detail.errors.delivery_file_info_not_found.message', 'notifiche'),
    };
  }
}