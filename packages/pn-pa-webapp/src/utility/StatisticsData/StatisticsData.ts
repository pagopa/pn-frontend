import {
  DigitalNotificationFocus,
  NotificationOverview,
  StatisticsDataTypes,
  StatisticsResponse,
} from '../../models/Statistics';

/**
 * Abstract Class which can be extended to implement a specific StatisticsData
 * type responsible to transform and store raw data received from the backend to
 *
 * @abstract
 * @class StatisticsData
 * @typedef {StatisticsData}
 */
abstract class StatisticsData {
  protected data: object = {};

  getData(): object {
    return this.data;
  }

  /**
   * Returns the name of the concrete StatisticsData subtype
   *
   * @public
   * @abstract
   * @returns {StatisticsDataTypes}
   */
  public abstract getName(): StatisticsDataTypes;

  /**
   * Parses the rawData passed as argument and store the resulting data into the data property
   *
   * @public
   * @abstract
   * @param {StatisticsResponse} rawData
   * @returns {this}
   */
  public abstract parse(rawData: StatisticsResponse): this;

  /**
   * Analyzes a chunk of raw data passed as argument adding the trasformed data to the data property
   *
   * @public
   * @abstract
   * @param {(NotificationOverview | DigitalNotificationFocus)} chunk
   */
  public abstract parseChunk(chunk: NotificationOverview | DigitalNotificationFocus): void;

  /**
   * Resets the 'data' property to its empty state
   *
   * @public
   * @abstract
   */
  public abstract resetData(): void;
}

export default StatisticsData;
