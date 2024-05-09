/* eslint-disable functional/immutable-data */
import {
  DigitalNotificationFocus,
  IDigitalStateStatistics,
  NotificationOverview,
  ResponseStatus,
  StatisticsResponse,
} from '../../models/Statistics';
import StatisticsData from './StatisticsData';
import { StatisticsDataTypes } from './StatisticsDataFactory';

export class DigitalStateStatisticsData extends StatisticsData {
  data: IDigitalStateStatistics = {
    [ResponseStatus.OK]: 0,
    [ResponseStatus.KO]: 0,
    [ResponseStatus.PROGRESS]: 0,
    [ResponseStatus.UNKNOWN]: 0,
  };

  public getName(): StatisticsDataTypes {
    return StatisticsDataTypes.DigitalStateStatistics;
  }

  parse(rawData: StatisticsResponse): this {
    const notifications_overview = rawData.notifications_overview;

    notifications_overview.forEach((element) => {
      this.parseChunk(element);
    });
    return this;
  }

  parseChunk(chunk: NotificationOverview | DigitalNotificationFocus) {
    // parse only if chunck has NotificationOverview type
    if ('notification_status' in chunk) {
      const status = chunk.status_digital_delivery;
      const count = +chunk.notifications_count;

      this.data[status] += count;
    }
  }

  resetData(): void {
    this.data = {
      [ResponseStatus.OK]: 0,
      [ResponseStatus.KO]: 0,
      [ResponseStatus.PROGRESS]: 0,
      [ResponseStatus.UNKNOWN]: 0,
    };
  }
}
