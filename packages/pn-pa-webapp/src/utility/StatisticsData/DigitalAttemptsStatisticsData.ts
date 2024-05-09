/* eslint-disable functional/immutable-data */
import {
  DeliveryMode,
  DigitalNotificationFocus,
  IAttemptsCount,
  NotificationOverview,
  StatisticsResponse,
} from '../../models/Statistics';
import StatisticsData from './StatisticsData';
import { StatisticsDataTypes } from './StatisticsDataFactory';

export class DigitalAttemptsStatisticsData extends StatisticsData {
  data: Array<IAttemptsCount> = [];

  public getName(): StatisticsDataTypes {
    return StatisticsDataTypes.DigitalAttemptsStatistics;
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

  parseChunk(chunk: NotificationOverview | DigitalNotificationFocus): void {
    // parse only if chunck has NotificationOverview type
    if ('notification_status' in chunk) {
      const notifications_count = +chunk.notifications_count;
      const attempt = +chunk.attempt_count_per_digital_notification;
      const detailsIndex = this.data.findIndex((item) => item.attempts === attempt);

      if (detailsIndex >= 0) {
        this.data[detailsIndex].count += notifications_count;
      } else {
        this.data.push({ attempts: attempt, count: notifications_count });
      }
    }
  }

  resetData(): void {
    this.data = [];
  }
}
