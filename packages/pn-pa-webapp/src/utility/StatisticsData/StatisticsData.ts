import {
  DigitalNotificationFocus,
  NotificationOverview,
  StatisticsResponse,
} from '../../models/Statistics';
import { StatisticsDataTypes } from './StatisticsDataFactory';

abstract class StatisticsData {
  protected data: object = {};

  getData(): object {
    return this.data;
  }

  public abstract getName(): StatisticsDataTypes;
  public abstract parse(rawData: StatisticsResponse): this;
  public abstract parseChunk(chunk: NotificationOverview | DigitalNotificationFocus): void;
  public abstract resetData(): void;
}

export default StatisticsData;
