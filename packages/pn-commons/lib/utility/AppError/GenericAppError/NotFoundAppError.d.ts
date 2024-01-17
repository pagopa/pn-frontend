import { ServerResponseError } from '../../../models/AppResponse';
import AppError from '../AppError';
export declare class NotFoundAppError extends AppError {
    constructor(error: ServerResponseError);
    getMessage(): {
        title: string;
        content: string;
    };
}
