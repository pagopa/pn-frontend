/* eslint-disable functional/immutable-data */
import {
  DigitalNotificationFocus,
  IDeliveryModeStatistics,
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
 * @class DeliveryModeStatisticsData
 * @typedef {DeliveryModeStatisticsData}
 * @extends {StatisticsData}
 */
export class DeliveryModeStatisticsData extends StatisticsData {
  data: IDeliveryModeStatistics = {
    [StatisticsDeliveryMode.ANALOG]: {
      count: 0,
      details: [],
    },
    [StatisticsDeliveryMode.DIGITAL]: {
      count: 0,
      details: [],
    },
    [StatisticsDeliveryMode.UNKNOWN]: {
      count: 0,
      details: [],
    },
  };

  public getName(): StatisticsDataTypes {
    return StatisticsDataTypes.DeliveryModeStatistics;
  }

  parse(rawData: StatisticsResponse): this {
    const notifications_overview = rawData.notificationsOverview;

    notifications_overview.forEach((element) => {
      this.parseChunk(element);
    });

    return this;
  }

  parseChunk(chunk: NotificationOverview | DigitalNotificationFocus): void {
    // parse only if chunk is a NotificationOverview
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
      [StatisticsDeliveryMode.ANALOG]: {
        count: 0,
        details: [],
      },
      [StatisticsDeliveryMode.DIGITAL]: {
        count: 0,
        details: [],
      },
      [StatisticsDeliveryMode.UNKNOWN]: {
        count: 0,
        details: [],
      },
    };
  }
}
