/* eslint-disable functional/immutable-data */
import {
  DigitaErrorTypes,
  DigitalNotificationFocus,
  IDigitalErrorsDetailStatistics,
  NotificationOverview,
  StatisticsDataTypes,
  StatisticsResponse,
} from '../../models/Statistics';
import StatisticsData from './StatisticsData';

/**
 * Extends StatisticsData type, go there for any documentation purpose
 *
 * @export
 * @class DigitalErrorsDetailStatisticsData
 * @typedef {DigitalErrorsDetailStatisticsData}
 * @extends {StatisticsData}
 */
export class DigitalErrorsDetailStatisticsData extends StatisticsData {
  data: IDigitalErrorsDetailStatistics = {
    [DigitaErrorTypes.INVALID_PEC]: {
      count: 0,
      attempts: 0,
    },
    [DigitaErrorTypes.DELIVERY_ERROR]: {
      count: 0,
      attempts: 0,
    },
    [DigitaErrorTypes.REJECTED]: {
      count: 0,
      attempts: 0,
    },
    [DigitaErrorTypes.UNKNOWN]: {
      count: 0,
      attempts: 0,
    },
  };

  public getName(): StatisticsDataTypes {
    return StatisticsDataTypes.DigitalErrorsDetailStatistics;
  }

  parse(rawData: StatisticsResponse): this {
    const digital_notification_focus = rawData.digital_notification_focus;

    digital_notification_focus.forEach((element) => {
      this.parseChunk(element);
    });
    return this;
  }

  parseChunk(chunk: NotificationOverview | DigitalNotificationFocus): void {
    // parse only if chunk is a DigitalNotificationFocus
    if ('error_type' in chunk) {
      const type = chunk.error_type;

      this.data[type].attempts += +chunk.failed_attempts_count;
      this.data[type].count += +chunk.notifications_count;
    }
  }

  resetData(): void {
    this.data = {
      [DigitaErrorTypes.INVALID_PEC]: {
        count: 0,
        attempts: 0,
      },
      [DigitaErrorTypes.DELIVERY_ERROR]: {
        count: 0,
        attempts: 0,
      },
      [DigitaErrorTypes.REJECTED]: {
        count: 0,
        attempts: 0,
      },
      [DigitaErrorTypes.UNKNOWN]: {
        count: 0,
        attempts: 0,
      },
    };
  }
}
