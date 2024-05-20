import { StatisticsParams, StatisticsParsedResponse } from '../../models/Statistics';
import statisticsDataFactoryManager from '../../utility/StatisticsData/StatisticsDataFactoryManager';
// import { apiClient } from '../apiClients';
import { statisticsMockResponse } from './statistics.mock';

// import { STATISTICS } from './statistics.routes';

export /**
 * Retrieve statistics data from the backend
 *
 * @type {{ getStatistics: (params: StatisticsParams<string>) => Promise<StatisticsParsedResponse>; }}
 */
const StatisticsApi = {
  // getStatistics: (params: StatisticsParams<string>): Promise<StatisticsParsedResponse> =>
  //   apiClient.get<StatisticsResponse>(STATISTICS(params)).then((response) => {
  //    const rawData = response.data;

  getStatistics: (params: StatisticsParams<string>): Promise<StatisticsParsedResponse> =>
    new Promise((resolve) => {
      console.info(params);
      const factory = statisticsDataFactoryManager.factory;
      const parsedData = factory.createAll(statisticsMockResponse);
      const rawData = statisticsMockResponse;

      resolve({
        sender_id: rawData.sender_id,
        genTimestamp: rawData.genTimestamp,
        lastDate: rawData.lastDate,
        startDate: rawData.startDate,
        endDate: rawData.endDate,
        data: parsedData,
      });
    }),
};
