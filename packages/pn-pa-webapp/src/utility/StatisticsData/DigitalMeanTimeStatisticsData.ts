/* eslint-disable functional/immutable-data */
import {
  DigitalNotificationFocus,
  IDigitalMeanTimeStatistics,
  NotificationOverview,
  StatisticsResponse,
} from '../../models/Statistics';
import StatisticsData from './StatisticsData';
import { StatisticsDataTypes } from './StatisticsDataFactory';

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
    const notifications_overview = rawData.notifications_overview;

    notifications_overview.forEach((element) => {
      this.parseChunk(element);
    });
    return this;
  }

  parseChunk(chunk: NotificationOverview | DigitalNotificationFocus) {
    // parse only if chunck has NotificationOverview type
    if ('notification_status' in chunk) {
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
