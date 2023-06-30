import { performThunkAction, AppCurrentStatus, GetDowntimeHistoryParams, DowntimeLogPage, LegalFactDocumentDetails } from "@pagopa-pn/pn-commons";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppStatusApi } from "../../api/appStatus/AppStatus.api";

export enum APP_STATUS_ACTIONS {
    GET_CURRENT_STATUS = 'getCurrentAppStatus',
    GET_DOWNTIME_LOG_PAGE = 'getDowntimeLogPage',
    GET_DOWNTIME_LEGAL_FACT_DOCUMENT_DETAILS = 'getDowntimeLegalFactDocumentDetails',
}

export const getCurrentAppStatus = createAsyncThunk<AppCurrentStatus>(
    APP_STATUS_ACTIONS.GET_CURRENT_STATUS,
    performThunkAction(() => AppStatusApi.getCurrentStatus())
);

export const getDowntimeLogPage = createAsyncThunk<DowntimeLogPage, GetDowntimeHistoryParams>(
    APP_STATUS_ACTIONS.GET_DOWNTIME_LOG_PAGE,
    performThunkAction((params: GetDowntimeHistoryParams) => AppStatusApi.getDowntimeLogPage(params))
);

export const getDowntimeLegalFactDocumentDetails = createAsyncThunk<LegalFactDocumentDetails, string>(
    APP_STATUS_ACTIONS.GET_DOWNTIME_LEGAL_FACT_DOCUMENT_DETAILS,
    performThunkAction((legalFactId: string) => AppStatusApi.getLegalFactDetails(legalFactId))
);
