import { AppResponse, ServerResponse } from '../../types/AppResponse';
export declare const createAppResponseError: (action: string, response: ServerResponse) => AppResponse;
export declare const createAppResponseSuccess: (action: string, response: ServerResponse) => AppResponse;
