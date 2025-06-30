import { ServerResponseError } from '../../models/AppResponse';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import AppError from './AppError';

export default class UnknownAppError extends AppError {
  constructor(error: ServerResponseError) {
    super(error, true);
  }

  getMessage() {
    return {
      title: getLocalizedOrDefaultLabel('common', 'errors.unknown.title', 'Errore'),
      content: getLocalizedOrDefaultLabel(
        'common',
        'errors.unknown.message',
        'Errore non previsto.'
      ),
    };
  }
}
