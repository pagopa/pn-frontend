import { ServerResponseError } from '../../models/AppResponse';
import AppError from './AppError';
export default class UnknownAppError extends AppError {
    constructor(error: ServerResponseError);
    getMessage(): {
        title: string;
        content: string;
    };
}
