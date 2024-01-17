import { AxiosInstance } from 'axios';
import { AppCurrentStatus, DowntimeLogPage, GetDowntimeHistoryParams, LegalFactDocumentDetails } from '../../models';
export declare class BadApiDataException extends Error {
    details: any;
    constructor(message: string, details: any);
}
export declare function createAppStatusApi(apiClientProvider: () => AxiosInstance): {
    getCurrentStatus: () => Promise<AppCurrentStatus>;
    getDowntimeLogPage: (params: GetDowntimeHistoryParams) => Promise<DowntimeLogPage>;
    getLegalFactDetails: (legalFactId: string) => Promise<LegalFactDocumentDetails>;
};
