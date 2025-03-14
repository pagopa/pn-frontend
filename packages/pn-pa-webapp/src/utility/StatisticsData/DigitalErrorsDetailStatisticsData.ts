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
    [DigitaErrorTypes.REJECTED]: {
      count: 0,
      attempts: 0,
    },
    [DigitaErrorTypes.DELIVERY_ERROR]: {
      count: 0,
      attempts: 0,
    },
    [DigitaErrorTypes.VIRUS_DETECTED]: {
      count: 0,
      attempts: 0,
    },
    [DigitaErrorTypes.SERVER_PEC_COMUNICATION]: {
      count: 0,
      attempts: 0,
    },
    [DigitaErrorTypes.SENDING_PEC]: {
      count: 0,
      attempts: 0,
    },
    [DigitaErrorTypes.INVALID_PEC]: {
      count: 0,
      attempts: 0,
    },
    [DigitaErrorTypes.MALFORMED_PEC_ADDRESS]: {
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
    const digital_notification_focus = rawData.digitalNotificationFocus;

    digital_notification_focus.forEach((element) => {
      this.parseChunk(element);
    });
    return this;
  }

  isDigitalErrorsDetailStatistics(type: string): type is DigitaErrorTypes {
    return (Object.values(DigitaErrorTypes) as Array<string>).includes(type);
  }

  parseChunk(chunk: NotificationOverview | DigitalNotificationFocus): void {
    // parse only if chunk is a DigitalNotificationFocus
    if ('error_type' in chunk) {
      const type = chunk.error_type;

      if (this.isDigitalErrorsDetailStatistics(type)) {
        this.data[type].attempts += +chunk.failed_attempts_count;
        this.data[type].count += +chunk.notifications_count;
      } else {
        this.data[DigitaErrorTypes.UNKNOWN].attempts += +chunk.failed_attempts_count;
        this.data[DigitaErrorTypes.UNKNOWN].count += +chunk.notifications_count;
      }
    }
  }

  resetData(): void {
    this.data = {
      [DigitaErrorTypes.REJECTED]: {
        count: 0,
        attempts: 0,
      },
      [DigitaErrorTypes.DELIVERY_ERROR]: {
        count: 0,
        attempts: 0,
      },
      [DigitaErrorTypes.VIRUS_DETECTED]: {
        count: 0,
        attempts: 0,
      },
      [DigitaErrorTypes.SERVER_PEC_COMUNICATION]: {
        count: 0,
        attempts: 0,
      },
      [DigitaErrorTypes.SENDING_PEC]: {
        count: 0,
        attempts: 0,
      },
      [DigitaErrorTypes.INVALID_PEC]: {
        count: 0,
        attempts: 0,
      },
      [DigitaErrorTypes.MALFORMED_PEC_ADDRESS]: {
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
