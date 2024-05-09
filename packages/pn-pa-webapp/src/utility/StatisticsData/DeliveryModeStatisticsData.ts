/* eslint-disable functional/immutable-data */
import {
  DeliveryMode,
  DigitalNotificationFocus,
  IDeliveryModeStatistics,
  NotificationOverview,
  StatisticsResponse,
} from '../../models/Statistics';
import StatisticsData from './StatisticsData';
import { StatisticsDataTypes } from './StatisticsDataFactory';

export class DeliveryModeStatisticsData extends StatisticsData {
  data: IDeliveryModeStatistics = {
    [DeliveryMode.ANALOG]: {
      count: 0,
      details: [],
    },
    [DeliveryMode.DIGITAL]: {
      count: 0,
      details: [],
    },
    [DeliveryMode.UNKNOWN]: {
      count: 0,
      details: [],
    },
  };

  public getName(): StatisticsDataTypes {
    return StatisticsDataTypes.DeliveryModeStatistics;
  }

  parse(rawData: StatisticsResponse): this {
    const notifications_overview = rawData.notifications_overview;

    notifications_overview.forEach((element) => {
      this.parseChunk(element);
    });

    return this;
  }

  parseChunk(chunk: NotificationOverview | DigitalNotificationFocus): void {
    // parse only if chunck has NotificationOverview type
    if ('notification_status' in chunk) {
      const send_date = chunk.notification_send_date;
      const type = chunk.notification_type;
      const count = +chunk.notifications_count;
      this.data[type].count += count;
      const detailsIndex = this.data[type].details.findIndex(
        (item) => item.send_date === send_date
      );

      if (detailsIndex >= 0) {
        this.data[type].details[detailsIndex].count += count;
      } else {
        this.data[type].details.push({ send_date, count });
      }
    }
  }

  resetData(): void {
    this.data = {
      [DeliveryMode.ANALOG]: {
        count: 0,
        details: [],
      },
      [DeliveryMode.DIGITAL]: {
        count: 0,
        details: [],
      },
      [DeliveryMode.UNKNOWN]: {
        count: 0,
        details: [],
      },
    };
  }
}
