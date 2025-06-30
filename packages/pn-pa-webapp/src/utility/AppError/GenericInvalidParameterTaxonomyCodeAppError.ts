import { AppError, ServerResponseError } from '@pagopa-pn/pn-commons';

export class GenericInvalidParameterTaxonomyCodeAppError extends AppError {
  private readonly translateFunction: (path: string, ns: string) => string = (path: string) => path;

  constructor(error: ServerResponseError, translateFunction: (path: string, ns: string) => string) {
    super(error, true);
    this.translateFunction = translateFunction;
  }

  getMessage() {
    return {
      title: this.translateFunction('new-notification.errors.invalid_parameter_taxonomy_code.title', 'notifiche'),
      content: this.translateFunction(
        'new-notification.errors.invalid_parameter_taxonomy_code.message',
        'notifiche'
      ),
    };
  }
}