import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';
import AppError from '../AppError';
export class UnavailableForLegalReasonsError extends AppError {
    constructor(error) {
        super(error);
    }
    getMessage() {
        return {
            title: getLocalizedOrDefaultLabel('common', 'errors.unavailable_legal_reasons.title', 'Piattaforma non accessibile'),
            content: getLocalizedOrDefaultLabel('common', 'errors.unavailable_legal_reasons.message', 'Non è possibile accedere alla piattaforma'),
        };
    }
}
