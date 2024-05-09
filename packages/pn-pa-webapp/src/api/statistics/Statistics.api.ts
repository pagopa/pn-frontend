import { StatisticsParams, StatisticsResponse } from '../../models/Statistics';
import statisticsDataFactoryManager from '../../utility/StatisticsData/StatisticsDataFactoryManager';
// import { apiClient } from '../apiClients';
import { statisticsMockResponse } from './statistics.mock';

// import { STATISTICS } from './statistics.routes';

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
      const factory = statisticsDataFactoryManager.factory;
      const data = factory.createAll(statisticsMockResponse);
      console.log('================== STATISTICS RESPONSE ==================');
      console.info(params);
      console.log(data);
      resolve(statisticsMockResponse);
    }),
};
