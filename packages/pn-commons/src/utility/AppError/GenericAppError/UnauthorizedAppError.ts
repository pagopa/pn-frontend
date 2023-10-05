import { ServerResponseError } from '../../../models/AppResponse';
import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';
import AppError from '../AppError';

export class UnauthorizedAppError extends AppError {
  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: getLocalizedOrDefaultLabel(
        'common',
        'errors.unauthorized.title',
        'Utente non autorizzato'
      ),
      content: getLocalizedOrDefaultLabel(
        'common',
        'errors.unauthorized.message',
        "L'utente corrente non ha le autorizzazioni."
      ),
    };
  }
}
