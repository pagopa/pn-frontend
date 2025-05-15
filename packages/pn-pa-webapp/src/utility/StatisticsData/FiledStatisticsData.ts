/* eslint-disable functional/immutable-data */

/* eslint-disable functional/no-let */
import { NotificationStatus } from '@pagopa-pn/pn-commons';

import {
  DigitalNotificationFocus,
  IFiledStatistics,
  NotificationOverview,
  StatisticsDataTypes,
  StatisticsResponse,
} from '../../models/Statistics';
import StatisticsData from './StatisticsData';

/**
 * Extends StatisticsData type, go there for any documentation purpose
 *
 * @export
 * @class FiledStatisticsData
 * @typedef {FiledStatisticsData}
 * @extends {StatisticsData}
 */
export class FiledStatisticsData extends StatisticsData {
  data: IFiledStatistics = {
    [NotificationStatus.ACCEPTED]: {
      count: 0,
      details: [],
    },
    [NotificationStatus.REFUSED]: {
      count: 0,
      details: [],
    },
  };

  public getName(): StatisticsDataTypes {
    return StatisticsDataTypes.FiledStatistics;
  }

  parse(rawData: StatisticsResponse): this {
    const notifications_overview = rawData.notificationsOverview;

    notifications_overview.forEach((element) => {
      this.parseChunk(element);
    });
    return this;
  }

  parseChunk(chunk: NotificationOverview | DigitalNotificationFocus) {
    // parse only if chunk is a NotificationOverview
    if ('notification_status' in chunk) {
      const status = chunk.notification_request_status;
      if (status === '-') {
        return;
      }
      const send_date = chunk.notification_send_date;
      const count = +chunk.notifications_count;
      this.data[status].count += count;
      const detailsIndex = this.data[status].details.findIndex(
        (item) => item.send_date === send_date
      );

      if (detailsIndex >= 0) {
        this.data[status].details[detailsIndex].count += count;
      } else {
        this.data[status].details.push({ send_date, count });
      }
    }
  }

  resetData(): void {
    this.data = {
      [NotificationStatus.ACCEPTED]: {
        count: 0,
        details: [],
      },
      [NotificationStatus.REFUSED]: {
        count: 0,
        details: [],
      },
    };
  }
}
