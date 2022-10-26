import { performThunkAction } from "@pagopa-pn/pn-commons";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppStatusApi } from "../../api/appStatus/AppStatus.api";
import { AppCurrentStatus, GetDowntimeHistoryParams, DowntimeLogPage } from "../../models/appStatus";

export enum APP_STATUS_ACTIONS {
    GET_CURRENT_STATUS = 'getCurrentStatus',
    GET_DOWNTIME_LOG_PAGE = 'getDowntimeLogPage',
}

export const getCurrentStatus = createAsyncThunk<AppCurrentStatus>(
    APP_STATUS_ACTIONS.GET_CURRENT_STATUS,
    performThunkAction(() => AppStatusApi.getCurrentStatus())
);

export const getDowntimeLogPage = createAsyncThunk<DowntimeLogPage, GetDowntimeHistoryParams>(
    APP_STATUS_ACTIONS.GET_DOWNTIME_LOG_PAGE,
    performThunkAction((params: GetDowntimeHistoryParams) => AppStatusApi.getDowntimeLogPage(params))
);
