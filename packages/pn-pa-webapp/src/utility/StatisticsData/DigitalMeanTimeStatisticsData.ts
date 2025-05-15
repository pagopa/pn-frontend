/* eslint-disable functional/immutable-data */
import {
  DigitalNotificationFocus,
  IDigitalMeanTimeStatistics,
  NotificationOverview,
  StatisticsDataTypes,
  StatisticsDeliveryMode,
  StatisticsResponse,
} from '../../models/Statistics';
import StatisticsData from './StatisticsData';

/**
 * Extends StatisticsData type, go there for any documentation purpose
 *
 * @export
 * @class DigitalMeanTimeStatisticsData
 * @typedef {DigitalMeanTimeStatisticsData}
 * @extends {StatisticsData}
 */
export class DigitalMeanTimeStatisticsData extends StatisticsData {
  data: IDigitalMeanTimeStatistics = {
    delivered: { count: 0, time: 0 },
    viewed: { count: 0, time: 0 },
    refined: { count: 0, time: 0 },
  };

  public getName(): StatisticsDataTypes {
    return StatisticsDataTypes.DigitalMeanTimeStatistics;
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
      const count = +chunk.notifications_count;
      if (chunk.notification_delivered === 'SI') {
        this.data.delivered.count += count;
        this.data.delivered.time += +chunk.delivery_time;
      }

      if (chunk.notification_viewed === 'SI') {
        this.data.viewed.count += count;
        this.data.viewed.time += +chunk.view_time;
      }

      if (chunk.notification_refined === 'SI') {
        this.data.refined.count += count;
        this.data.refined.time += +chunk.refinement_time;
      }
    }
  }

  resetData(): void {
    this.data = {
      delivered: { count: 0, time: 0 },
      viewed: { count: 0, time: 0 },
      refined: { count: 0, time: 0 },
    };
  }
}
