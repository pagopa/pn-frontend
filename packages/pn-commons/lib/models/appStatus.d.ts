export declare enum DowntimeStatus {
    OK = "OK",
    KO = "KO"
}
export declare enum KnownFunctionality {
    NotificationCreate = "NOTIFICATION_CREATE",
    NotificationVisualization = "NOTIFICATION_VISUALIZATION",
    NotificationWorkflow = "NOTIFICATION_WORKFLOW"
}
export declare function isKnownFunctionality(functionality: string): boolean;
export interface GetDowntimeHistoryParams {
    startDate: string;
    endDate?: string;
    functionality?: Array<KnownFunctionality>;
    page?: string;
    size?: string;
}
export interface Downtime {
    rawFunctionality: string;
    knownFunctionality?: KnownFunctionality;
    status: DowntimeStatus;
    startDate: string;
    endDate?: string;
    legalFactId?: string;
    fileAvailable?: boolean;
}
export interface FunctionalityStatus {
    rawFunctionality: string;
    knownFunctionality?: KnownFunctionality;
    isOperative: boolean;
    currentDowntime?: Downtime;
}
export interface AppCurrentStatus {
    appIsFullyOperative: boolean;
    statusByFunctionality: Array<FunctionalityStatus>;
    lastCheckTimestamp: string;
}
export interface DowntimeLogPage {
    downtimes: Array<Downtime>;
    nextPage?: string;
}
export interface LegalFactDocumentDetails {
    filename: string;
    contentLength: number;
    url: string;
}
export interface AppStatusData {
    currentStatus?: AppCurrentStatus;
    downtimeLogPage?: DowntimeLogPage;
    legalFactDocumentData?: LegalFactDocumentDetails;
    pagination: {
        size: number;
        page: number;
        resultPages: Array<string>;
    };
}
/**
 * Possible errors
 * - functionality not in the expected set
 *   (if possible, taken from the response from /downtime/v1/status)
 *   but in order to verify it, I should be able to access the Redux store
 *   (to avoid re-fetching the set of functionalities each time downtimes are retrieved).
 *   Hence I won't validate, and rather indicate "unknown functionality" in the FE.
 * - status not in the DowntimeStatus set
 * - startDate not a valid date
 * - endDate, if present, not a valid date
 */
export interface DowntimeDTO {
    functionality: string;
    status: string;
    startDate: string;
    endDate?: string;
    legalFactId?: string;
    fileAvailable?: boolean;
}
/**
 * Possible errors: just those of open incidents
 */
export interface AppStatusDTO {
    functionalities: Array<string>;
    openIncidents: Array<DowntimeDTO>;
}
export interface DowntimeLogPageDTO {
    result: Array<DowntimeDTO>;
    nextPage?: string;
}
