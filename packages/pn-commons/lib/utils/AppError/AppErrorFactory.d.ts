import { HTTPStatusCode, ServerResponseError } from "../../types/AppResponse";
import AppError from "./AppError";
declare class AppErrorFactory {
    protected getCustomError: (error: ServerResponseError) => AppError;
    create(error: ServerResponseError | HTTPStatusCode): AppError;
}
export default AppErrorFactory;
