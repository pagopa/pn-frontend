import { AppResponseError, ErrorMessage, ServerResponseError } from '../../models/AppResponse';
declare abstract class AppError {
    protected code: string;
    protected element: string;
    protected detail: string;
    constructor(error: ServerResponseError);
    getResponseError(): AppResponseError;
    abstract getMessage(): ErrorMessage;
}
export default AppError;
