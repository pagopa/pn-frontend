import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

enum InvalidParameter {
  FISCAL_CODE = 'Invalid taxId for recipient',
}

export class GenericInvalidParameterAppError extends AppError {
  private translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    if (this.detail.startsWith(InvalidParameter.FISCAL_CODE)) {
      return {
        title: this.translateFunction('new-notification.errors.fiscal_code.title', 'notifiche'),
        content: this.translateFunction('new-notification.errors.fiscal_code.message', 'notifiche'),
      };
    }
    return {
      title: this.translateFunction('new-notification.errors.invalid_parameter.title', 'notifiche'),
      content: this.translateFunction(
        'new-notification.errors.invalid_parameter.message',
        'notifiche'
      ),
    };
  }
}
