import { getLocalizedOrDefaultLabel } from '../../../services/localization.service';
import { ServerResponseError } from '../../../types/AppResponse';
import AppError from '../AppError';

export class UnavailableForLegalReasonsError extends AppError {
  constructor(error: ServerResponseError) {
    super(error);
  }

  getMessage() {
    return {
      title: getLocalizedOrDefaultLabel(
        'common',
        'errors.unavailable_legal_reasons.title',
        'Paittaforma non operativa'
      ),
      content: getLocalizedOrDefaultLabel(
        'common',
        'errors.unavailable_legal_reasons.message',
        'La Piattaforma non è operativa.'
      ),
    };
  }
}
