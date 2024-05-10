import {
  formatToTimezoneString,
  getEndOfDay,
  getStartOfDay,
  performThunkAction,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { StatisticsApi } from '../../api/statistics/Statistics.api';
import { StatisticsParams, StatisticsParsedResponse } from '../../models/Statistics';

export enum STATISTICS_ACTIONS {
  GET_STATISTICS = 'getStatistics',
}

export const getStatistics = createAsyncThunk<StatisticsParsedResponse, StatisticsParams<Date>>(
  STATISTICS_ACTIONS.GET_STATISTICS,
  performThunkAction((params: StatisticsParams<Date>) => {
    const apiParams = {
      ...params,
      startDate: formatToTimezoneString(getStartOfDay(params.startDate)),
      endDate: formatToTimezoneString(getEndOfDay(params.endDate)),
    };
    return StatisticsApi.getStatistics(apiParams);
  })
);
