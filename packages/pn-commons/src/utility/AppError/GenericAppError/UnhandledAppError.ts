import { ServerResponseError } from '../../../models/AppResponse';
import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';
import AppError from '../AppError';

export class UnhandledAppError extends AppError {
  constructor(error: ServerResponseError) {
    super(error, true);
  }

  getMessage() {
    return {
      title: getLocalizedOrDefaultLabel(
        'common',
        'errors.unhandled.title',
        'Si è verificato un errore'
      ),
      content: getLocalizedOrDefaultLabel(
        'common',
        'errors.unhandled.message',
        'Il servizio non è disponibile. Riprova più tardi. Se l’errore si ripete, contatta l’assistenza e comunica le informazioni errore.'
      ),
    };
  }
}
