import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

export class DeliveryInvalidParameterGroupAppError extends AppError {
  private readonly translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error, true);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    return {
      title: this.translateFunction('new-notification.errors.delivery_invalid_parameter_group.title', 'notifiche'),
      content: this.translateFunction(
        'notification.errors.delivery_invalid_parameter_group.message',
        'notifiche'
      ),
    };
  }
}