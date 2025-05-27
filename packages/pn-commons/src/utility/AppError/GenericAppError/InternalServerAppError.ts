import { ServerResponseError } from '../../../models/AppResponse';
import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';
import AppError from '../AppError';

export class InternalServerAppError extends AppError {
  constructor(error: ServerResponseError) {
    super(error, true);
  }

  getMessage() {
    return {
      title: getLocalizedOrDefaultLabel(
        'common',
        'errors.internal_server.title',
        'Il servizio non è disponibile'
      ),
      content: getLocalizedOrDefaultLabel(
        'common',
        'errors.internal_server.message',
        'Per un problema temporaneo del servizio, la tua richiesta non è stata inviata. Riprova più tardi.'
      ),
    };
  }
}
