/* eslint-disable functional/immutable-data */
import {
  DeliveryMode,
  DigitalNotificationFocus,
  IDigitalStateStatistics,
  NotificationOverview,
  ResponseStatus,
  StatisticsDataTypes,
  StatisticsResponse,
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

    const digital_notifications = notifications_overview.filter(
      (item) => item.notification_type === DeliveryMode.DIGITAL
    );

    digital_notifications.forEach((element) => {
      this.parseChunk(element);
    });
    return this;
  }

  parseChunk(chunk: NotificationOverview | DigitalNotificationFocus) {
    // parse only if chunk is a NotificationOverview
    if ('notification_status' in chunk && chunk.notification_type === DeliveryMode.DIGITAL) {
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
