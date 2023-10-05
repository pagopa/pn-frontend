import { ServerResponseError } from '../../../models/AppResponse';
import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';
import AppError from '../AppError';

export class NotFoundAppError extends AppError {
  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: getLocalizedOrDefaultLabel('common', 'errors.not_found.title', 'Risorsa non trovata'),
      content: getLocalizedOrDefaultLabel(
        'common',
        'errors.not_found.message',
        'Si è verificato un errore. Si prega di riprovare più tardi.'
      ),
    };
  }
}
