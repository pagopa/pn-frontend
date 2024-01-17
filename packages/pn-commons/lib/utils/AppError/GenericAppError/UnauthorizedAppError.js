import { getLocalizedOrDefaultLabel } from "../../../services/localization.service";
import AppError from "../AppError";
export class UnauthorizedAppError extends AppError {
    constructor(error) {
        super(error);
    }
    getMessage() {
        return {
            title: getLocalizedOrDefaultLabel("common", "errors.unauthorized.title", "Utente non autorizzato"),
            content: getLocalizedOrDefaultLabel("common", "errors.unauthorized.message", "L'utente corrente non ha le autorizzazioni.")
        };
    }
}
