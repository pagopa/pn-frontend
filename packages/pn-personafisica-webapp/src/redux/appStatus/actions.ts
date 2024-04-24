import {
  AppCurrentStatus,
  DowntimeLogHistory,
  GetDowntimeHistoryParams,
  LegalFactDocumentDetails,
  parseError,
  validateCurrentStatus,
  validateHistory,
  validateLegaFact,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { DowntimeApiFactory } from '../../generated-client/downtime-logs';

export enum APP_STATUS_ACTIONS {
  GET_CURRENT_STATUS = 'getCurrentAppStatus',
  GET_DOWNTIME_HISTORY = 'getDowntimeHistory',
  GET_DOWNTIME_LEGAL_FACT_DOCUMENT_DETAILS = 'getDowntimeLegalFactDocumentDetails',
}

export const getCurrentAppStatus = createAsyncThunk<AppCurrentStatus>(
  APP_STATUS_ACTIONS.GET_CURRENT_STATUS,
  async (_params, { rejectWithValue }) => {
    try {
      const downtimeApiFactory = DowntimeApiFactory(undefined, undefined, apiClient);
      const response = await downtimeApiFactory.getCurrentStatusV1();
      validateCurrentStatus(response.data as AppCurrentStatus);
      return response.data as AppCurrentStatus;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getDowntimeHistory = createAsyncThunk<DowntimeLogHistory, GetDowntimeHistoryParams>(
  APP_STATUS_ACTIONS.GET_DOWNTIME_HISTORY,
  async (params: GetDowntimeHistoryParams, { rejectWithValue }) => {
    try {
      const downtimeApiFactory = DowntimeApiFactory(undefined, undefined, apiClient);
      const response = await downtimeApiFactory.getStatusHistoryV1(
        params.startDate,
        params.endDate,
        params.page,
        params.size
      );
      validateHistory(response.data as DowntimeLogHistory);
      return response.data as DowntimeLogHistory;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
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
      validateLegaFact(response.data as LegalFactDocumentDetails);
      return response.data as LegalFactDocumentDetails;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);
