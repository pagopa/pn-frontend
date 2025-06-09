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
        'Si è verificato un errore'
      ),
      content: getLocalizedOrDefaultLabel(
        'common',
        'errors.internal_server.message',
        'Il servizio non è disponibile a causa di un problema tecnico. Riprova più tardi. Se l’errore si ripete, contatta l’assistenza e comunica le informazioni errore.'
      ),
    };
  }
}
