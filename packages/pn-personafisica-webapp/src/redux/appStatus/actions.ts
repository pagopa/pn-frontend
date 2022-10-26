import { performThunkAction } from "@pagopa-pn/pn-commons";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppStatusApi } from "../../api/appStatus/AppStatus.api";
import { AppCurrentStatus, GetDowntimeHistoryParams, IncidentsPage } from "../../models/appStatus";

export enum APP_STATUS_ACTIONS {
    GET_CURRENT_STATUS = 'getCurrentStatus',
    GET_INCIDENTS_PAGE = 'getIncidentsPage',
}

export const getCurrentStatus = createAsyncThunk<AppCurrentStatus>(
    APP_STATUS_ACTIONS.GET_CURRENT_STATUS,
    performThunkAction(() => AppStatusApi.getCurrentStatus())
);

export const getIncidentsPage = createAsyncThunk<IncidentsPage, GetDowntimeHistoryParams>(
    APP_STATUS_ACTIONS.GET_INCIDENTS_PAGE,
    performThunkAction((params: GetDowntimeHistoryParams) => AppStatusApi.getDowntimePage(params))
);
