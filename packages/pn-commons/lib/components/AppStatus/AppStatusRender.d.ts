/// <reference types="react" />
import { AppStatusData, GetDowntimeHistoryParams } from '../../models';
import { PaginationData } from '../../models/Pagination';
type Props = {
    appStatus: AppStatusData;
    clearLegalFactDocument: () => void;
    fetchCurrentStatus: () => void;
    fetchDowntimeLogPage: (params: GetDowntimeHistoryParams) => void;
    fetchDowntimeLegalFactDocumentDetails: (legalFactId: string) => undefined;
    clearPagination: () => void;
    setPagination: (data: PaginationData) => void;
    actionIds: {
        GET_CURRENT_STATUS: string;
        GET_DOWNTIME_LOG_PAGE: string;
    };
    handleTrackDownloadCertificateOpposable3dparties?: () => void;
};
export declare const AppStatusRender: (props: Props) => JSX.Element;
export {};
