import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

export class DeliveryPushFileNotFoundAppError extends AppError {
  private readonly translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error, true);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    return {
      title: this.translateFunction('detail.errors.delivery_push_file_not_found.title', 'notifiche'),
      content: this.translateFunction(
        'detail.errors.delivery_push_file_not_found.message',
        'notifiche'
      ),
    };
  }
}