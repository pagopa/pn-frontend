import { ServerResponseError } from '../../../models/AppResponse';
import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';
import AppError from '../AppError';

export class UnhandledAppError extends AppError {
  constructor(error: ServerResponseError) {
    super(error, true);
  }

  getMessage() {
    return {
      title: getLocalizedOrDefaultLabel('common', 'errors.unhandled.title', 'Errore generico'),
      content: getLocalizedOrDefaultLabel(
        'common',
        'errors.unhandled.message',
        'Si è verificato un errore. Si prega di riprovare più tardi.'
      ),
    };
  }
}
