/* eslint-disable functional/immutable-data */
import {
  DigitalNotificationFocus,
  ILastStateStatistics,
  NotificationOverview,
  NotificationStatus,
  StatisticsDataTypes,
  StatisticsResponse,
} from '../../models/Statistics';
import StatisticsData from './StatisticsData';

/**
 * Extends StatisticsData type, go there for any documentation purpose
 *
 * @export
 * @class LastStateStatisticsData
 * @typedef {LastStateStatisticsData}
 * @extends {StatisticsData}
 */
export class LastStateStatisticsData extends StatisticsData {
  data: ILastStateStatistics = {
    [NotificationStatus.ACCEPTED]: 0,
    [NotificationStatus.REFUSED]: 0,
    [NotificationStatus.DELIVERING]: 0,
    [NotificationStatus.DELIVERED]: 0,
    [NotificationStatus.VIEWED]: 0,
    [NotificationStatus.EFFECTIVE_DATE]: 0,
    [NotificationStatus.CANCELLED]: 0,
    [NotificationStatus.UNREACHABLE]: 0,
  };

  public getName(): StatisticsDataTypes {
    return StatisticsDataTypes.LastStateStatistics;
  }

  parse(rawData: StatisticsResponse): this {
    const notifications_overview = rawData.notifications_overview;

    notifications_overview.forEach((element) => {
      this.parseChunk(element);
    });
    return this;
  }

  parseChunk(chunk: NotificationOverview | DigitalNotificationFocus) {
    // parse only if chunk is a NotificationOverview
    if ('notification_status' in chunk) {
      const status = chunk.notification_status;

      this.data[status] += +chunk.notifications_count;
    }
  }

  resetData(): void {
    this.data = {
      [NotificationStatus.ACCEPTED]: 0,
      [NotificationStatus.REFUSED]: 0,
      [NotificationStatus.DELIVERING]: 0,
      [NotificationStatus.DELIVERED]: 0,
      [NotificationStatus.VIEWED]: 0,
      [NotificationStatus.EFFECTIVE_DATE]: 0,
      [NotificationStatus.CANCELLED]: 0,
      [NotificationStatus.UNREACHABLE]: 0,
    };
  }
}
