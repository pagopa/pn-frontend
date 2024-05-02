import { StatisticsParams, StatisticsResponse } from '../../redux/statistics/types';
import { apiClient } from '../apiClients';
import { statisticsMockResponse } from './statistics.mock';
import { STATISTICS } from './statistics.routes';

export const StatisticsApi = {
  /**
   * Gets current user notifications
   * @param  {string} startDate
   * @param  {string} endDate
   * @returns Promise
   */

  // getStatistics: (params: StatisticsParams<string>): Promise<StatisticsResponse> =>
  //   apiClient.get<StatisticsResponse>(STATISTICS(params)).then((response) => response.data),
  getStatistics: (params: StatisticsParams<string>): Promise<StatisticsResponse> =>
    new Promise((resolve) => {
      resolve(statisticsMockResponse);
    }),
};
