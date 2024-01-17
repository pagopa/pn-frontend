import { ServerResponseError } from '../../../types/AppResponse';
import AppError from '../AppError';
export declare class UnavailableForLegalReasonsError extends AppError {
    constructor(error: ServerResponseError);
    getMessage(): {
        title: string;
        content: string;
    };
}
