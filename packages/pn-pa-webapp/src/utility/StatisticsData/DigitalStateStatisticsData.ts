/* eslint-disable functional/immutable-data */
import {
  DigitalNotificationFocus,
  IDigitalStateStatistics,
  NotificationOverview,
  StatisticsDataTypes,
  StatisticsDeliveryMode,
  StatisticsResponse,
  StatisticsResponseStatus,
} from '../../models/Statistics';
import StatisticsData from './StatisticsData';

/**
 * Extends StatisticsData type, go there for any documentation purpose
 *
 * @export
 * @class DigitalStateStatisticsData
 * @typedef {DigitalStateStatisticsData}
 * @extends {StatisticsData}
 */
export class DigitalStateStatisticsData extends StatisticsData {
  data: IDigitalStateStatistics = {
    [StatisticsResponseStatus.OK]: 0,
    [StatisticsResponseStatus.KO]: 0,
    [StatisticsResponseStatus.PROGRESS]: 0,
    [StatisticsResponseStatus.UNKNOWN]: 0,
  };

  public getName(): StatisticsDataTypes {
    return StatisticsDataTypes.DigitalStateStatistics;
  }

  parse(rawData: StatisticsResponse): this {
    const notifications_overview = rawData.notificationsOverview;

    const digital_notifications = notifications_overview.filter(
      (item) => item.notification_type === StatisticsDeliveryMode.DIGITAL
    );

    digital_notifications.forEach((element) => {
      this.parseChunk(element);
    });
    return this;
  }

  parseChunk(chunk: NotificationOverview | DigitalNotificationFocus) {
    // parse only if chunk is a NotificationOverview
    if (
      'notification_status' in chunk &&
      chunk.notification_type === StatisticsDeliveryMode.DIGITAL
    ) {
      const status = chunk.status_digital_delivery;
      const count = +chunk.notifications_count;

      this.data[status] += count;
    }
  }

  resetData(): void {
    this.data = {
      [StatisticsResponseStatus.OK]: 0,
      [StatisticsResponseStatus.KO]: 0,
      [StatisticsResponseStatus.PROGRESS]: 0,
      [StatisticsResponseStatus.UNKNOWN]: 0,
    };
  }
}
