import { getLocalizedOrDefaultLabel } from "../../../services/localization.service";
import AppError from "../AppError";
export class NotFoundAppError extends AppError {
    constructor(error) {
        super(error);
    }
    getMessage() {
        return {
            title: getLocalizedOrDefaultLabel("common", "errors.not_found.title", "Risorsa non trovata"),
            content: getLocalizedOrDefaultLabel("common", "errors.not_found.message", "Si è verificato un errore. Si prega di riprovare più tardi.")
        };
    }
}
