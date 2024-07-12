import {
  formatToSlicedISOString,
  getEndOfDay,
  getStartOfDay,
  parseError,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { SenderDashboardApiFactory } from '../../generated-client/sender-dashboard';
import {
  StatisticsParams,
  StatisticsParsedResponse,
  StatisticsResponse,
} from '../../models/Statistics';
import statisticsDataFactoryManager from '../../utility/StatisticsData/StatisticsDataFactoryManager';

export enum STATISTICS_ACTIONS {
  GET_STATISTICS = 'getStatistics',
}

export const getStatistics = createAsyncThunk(
  STATISTICS_ACTIONS.GET_STATISTICS,
  async (params: StatisticsParams<Date>, { rejectWithValue }) => {
    try {
      const senderDashboardFactory = SenderDashboardApiFactory(undefined, undefined, apiClient);
      const apiParams = {
        ...params,
        startDate: formatToSlicedISOString(getStartOfDay(params.startDate)),
        endDate: formatToSlicedISOString(getEndOfDay(params.endDate)),
      };
      const response = await senderDashboardFactory.getDashboardDataV1(
        apiParams.cxType,
        apiParams.cxId,
        apiParams.startDate,
        apiParams.endDate
      );
      const factory = statisticsDataFactoryManager.factory;

      return response.data
        ? ({
            senderId: response.data.senderId,
            genTimestamp: response.data.genTimestamp,
            lastDate: response.data.lastDate,
            startDate: response.data.startDate,
            endDate: response.data.endDate,
            data: factory.createAll(response.data as StatisticsResponse),
          } as StatisticsParsedResponse)
        : null;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);
