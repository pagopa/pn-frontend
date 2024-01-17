import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';
import AppError from '../AppError';
export class ForbiddenAppError extends AppError {
    constructor(error) {
        super(error);
    }
    getMessage() {
        return {
            title: getLocalizedOrDefaultLabel('common', 'errors.forbidden.title', 'La sessione è scaduta'),
            content: getLocalizedOrDefaultLabel('common', 'errors.forbidden.message', 'Entra e accedi con SPID o CIE.'),
        };
    }
}
