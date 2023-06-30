import { getLocalizedOrDefaultLabel } from '../../../services/localization.service';
import { ServerResponseError } from '../../../types/AppResponse';
import AppError from '../AppError';

export class BadRequestAppError extends AppError {
  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: getLocalizedOrDefaultLabel(
        "common",
        "errors.bad_request.title",
        "Errore nell'invio dei dati"
      ),
      content: getLocalizedOrDefaultLabel(
        "common",
        "errors.bad_request.message",
        "Il formato della richiesta non è valido."
      ),
    };
  }
}
