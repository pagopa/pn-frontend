import { ServerResponseError } from '../../../models/AppResponse';
import AppError from '../AppError';
export declare class UnhandledAppError extends AppError {
    constructor(error: ServerResponseError);
    getMessage(): {
        title: string;
        content: string;
    };
}
