import {
  AppCurrentStatus,
  DowntimeLogPage,
  GetDowntimeHistoryParams,
  LegalFactDocumentDetails,
  parseError,
  performThunkAction,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { AppStatusApi } from '../../api/appStatus/AppStatus.api';
import { DowntimeApiFactory } from '../../generated-client/downtime-logs';

export enum APP_STATUS_ACTIONS {
  GET_CURRENT_STATUS = 'getCurrentAppStatus',
  GET_DOWNTIME_LOG_PAGE = 'getDowntimeLogPage',
  GET_DOWNTIME_LEGAL_FACT_DOCUMENT_DETAILS = 'getDowntimeLegalFactDocumentDetails',
}

export const getCurrentAppStatus = createAsyncThunk<AppCurrentStatus>(
  APP_STATUS_ACTIONS.GET_CURRENT_STATUS,
  async (_params, { rejectWithValue }) => {
    try {
      const downtimeApiFactory = DowntimeApiFactory(undefined, undefined, apiClient);
      const response = await downtimeApiFactory.getCurrentStatusV1();
      return response.data as AppCurrentStatus;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getDowntimeLogPage = createAsyncThunk<DowntimeLogPage, GetDowntimeHistoryParams>(
  APP_STATUS_ACTIONS.GET_DOWNTIME_LOG_PAGE,
  performThunkAction((params: GetDowntimeHistoryParams) => AppStatusApi.getDowntimeLogPage(params))
);

export const getDowntimeLegalFactDocumentDetails = createAsyncThunk<
  LegalFactDocumentDetails,
  string
>(
  APP_STATUS_ACTIONS.GET_DOWNTIME_LEGAL_FACT_DOCUMENT_DETAILS,
  async (params: string, { rejectWithValue }) => {
    try {
      const downtimeApiFactory = DowntimeApiFactory(undefined, undefined, apiClient);
      const response = await downtimeApiFactory.getLegalFactV1(params);
      return response.data as LegalFactDocumentDetails;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);
