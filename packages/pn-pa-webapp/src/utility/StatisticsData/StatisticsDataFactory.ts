/* eslint-disable functional/immutable-data */
import {
  StatisticsDataTypes,
  StatisticsParsedData,
  StatisticsResponse,
} from '../../models/Statistics';
import { DeliveryModeStatisticsData } from './DeliveryModeStatisticsData';
import { DigitalAttemptsStatisticsData } from './DigitalAttemptsStatisticsData';
import { DigitalErrorsDetailStatisticsData } from './DigitalErrorsDetailStatisticsData';
import { DigitalMeanTimeStatisticsData } from './DigitalMeanTimeStatisticsData';
import { DigitalStateStatisticsData } from './DigitalStateStatisticsData';
import { FiledStatisticsData } from './FiledStatisticsData';
import { LastStateStatisticsData } from './LastStateStatisticsData';
import StatisticsData from './StatisticsData';

/**
 * Factory Class for creating instances which extends StatisticsData type
 *
 * @class StatisticsDataFactory
 * @typedef {StatisticsDataFactory}
 */
class StatisticsDataFactory {
  /**
   * Creates and return an instance of a specific StatisticsData subtype
   *
   * @public
   * @param {string} type
   * @returns {(StatisticsData | null)}
   */
  public create(type: string): StatisticsData | null {
    switch (type) {
      case StatisticsDataTypes.FiledStatistics:
        return new FiledStatisticsData();

      case StatisticsDataTypes.LastStateStatistics:
        return new LastStateStatisticsData();

      case StatisticsDataTypes.DeliveryModeStatistics:
        return new DeliveryModeStatisticsData();

      case StatisticsDataTypes.DigitalStateStatistics:
        return new DigitalStateStatisticsData();

      case StatisticsDataTypes.DigitalMeanTimeStatistics:
        return new DigitalMeanTimeStatisticsData();

      case StatisticsDataTypes.DigitalErrorsDetailStatistics:
        return new DigitalErrorsDetailStatisticsData();

      case StatisticsDataTypes.DigitalAttemptsStatistics:
        return new DigitalAttemptsStatisticsData();

      default:
        return null;
    }
  }

  /**
   * Cycles through every StatisticsData subtype and generates the corresponding
   * transformed data starting from the raw data passed as argument
   *
   * @public
   * @param {StatisticsResponse} rawData
   * @returns {StatisticsParsedData}
   */
  public createAll(rawData: StatisticsResponse): StatisticsParsedData {
    const statisticsObjects: Array<StatisticsData> = [];
    const retData: any = {};
    Object.keys(StatisticsDataTypes)
      .filter((key) => isNaN(Number(key)))
      .forEach((element) => {
        const statisticsObject = this.create(element);
        if (statisticsObject) {
          statisticsObjects.push(statisticsObject);
        }
      });

    const notifications_overview = rawData.notificationsOverview;
    const notification_focus = rawData.digitalNotificationFocus;

    // pass every notifications_overview item to every StatisticsData subtype object to parse it
    notifications_overview?.forEach((item) =>
      statisticsObjects.forEach((obj) => obj.parseChunk(item))
    );

    // pass every digital_notification_focus item to every StatisticsData subtype object to parse it
    notification_focus?.forEach((item) => statisticsObjects.forEach((obj) => obj.parseChunk(item)));

    statisticsObjects.forEach((item) => {
      const name = item.getName();
      const data = item.getData();

      retData[name] = data;
    });

    return retData;
  }
}

export default StatisticsDataFactory;
