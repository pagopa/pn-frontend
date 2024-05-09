/* eslint-disable functional/immutable-data */
import { StatisticsResponse } from '../../models/Statistics';
import { DeliveryModeStatisticsData } from './DeliveryModeStatisticsData';
import { DigitalAttemptsStatisticsData } from './DigitalAttemptsStatisticsData';
import { DigitalErrorsDetailStatisticsData } from './DigitalErrorsDetailStatisticsData';
import { DigitalMeanTimeStatisticsData } from './DigitalMeanTimeStatisticsData';
import { DigitalStateStatisticsData } from './DigitalStateStatisticsData';
import { FiledStatisticsData } from './FiledStatisticsData';
import { LastStateStatisticsData } from './LastStateStatisticsData';
import StatisticsData from './StatisticsData';

export enum StatisticsDataTypes {
  FiledStatistics = 'FiledStatistics',
  LastStateStatistics = 'LastStateStatistics',
  DeliveryModeStatistics = 'DeliveryModeStatistics',
  DigitalStateStatistics = 'DigitalStateStatistics',
  DigitalMeanTimeStatistics = 'DigitalMeanTimeStatistics',
  DigitalErrorsDetailStatistics = 'DigitalErrorsDetailStatistics',
  DigitalAttemptsStatistics = 'DigitalAttemptsStatistics',
}

// interface ParsedStatisticDataObj {
//   name: StatisticsDataTypes;
//   data: object;
// }

interface ParsedStatisticDataObj {
  [StatisticsDataTypes.FiledStatistics]?: object;
  [StatisticsDataTypes.LastStateStatistics]?: object;
  [StatisticsDataTypes.DeliveryModeStatistics]?: object;
  [StatisticsDataTypes.DigitalStateStatistics]?: object;
  [StatisticsDataTypes.DigitalMeanTimeStatistics]?: object;
  [StatisticsDataTypes.DigitalErrorsDetailStatistics]?: object;
  [StatisticsDataTypes.DigitalAttemptsStatistics]?: object;
}

class StatisticsDataFactory {
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

  // public createAll(rawData: StatisticsResponse): Array<object> {
  public createAll(rawData: StatisticsResponse): ParsedStatisticDataObj {
    const statisticsObjects: Array<StatisticsData> = [];
    // const retData: Array<ParsedStatisticDataObj> = [];
    const retData: ParsedStatisticDataObj = {};
    Object.keys(StatisticsDataTypes)
      .filter((key) => isNaN(Number(key)))
      .forEach((element) => {
        const statisticsObject = this.create(element);
        if (statisticsObject) {
          statisticsObjects.push(statisticsObject);
        }
      });

    const notifications_overview = rawData.notifications_overview;
    const notification_focus = rawData.digital_notification_focus;

    // pass every notifications_overview item to every StatisticsData object to parse it
    notifications_overview.forEach((item) =>
      statisticsObjects.forEach((obj) => obj.parseChunk(item))
    );

    // pass every digital_notification_focus item to every StatisticsData object to parse it
    notification_focus.forEach((item) => statisticsObjects.forEach((obj) => obj.parseChunk(item)));

    statisticsObjects.forEach((item) => {
      const name = item.getName();
      const data = item.getData();

      // retData.push({ name: StatisticsDataTypes[name], data });
      retData[name] = data;
    });

    return retData;
  }
}

export default StatisticsDataFactory;
