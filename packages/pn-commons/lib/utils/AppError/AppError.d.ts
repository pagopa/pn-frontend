import { ServerResponseError, ErrorMessage, AppResponseError } from '../../types/AppResponse';
declare abstract class AppError {
    protected code: string;
    protected element: string;
    protected detail: string;
    constructor(error: ServerResponseError);
    getErrorDetail(): ServerResponseError;
    getResponseError(): AppResponseError;
    abstract getMessage(): ErrorMessage;
}
export default AppError;
