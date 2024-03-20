import { StrategyEventType } from '../../models';

/**
 * It is the set of all those operations that taken the type of event
 * and the data associated with it generates the event to track.
 *
 * @date 23/2/2024 - 17:40:31
 *
 * @export
 * @abstract
 * @class EventStrategy
 * @typedef {EventStrategy}
 */
interface EventStrategy {
  /**
   * This function manage receiving data as input
   * of the event and make the necessary transformations
   *
   * @date 20/3/2024 - 10:23:25
   *
   * @param {unknown} data
   * @returns {StrategyEventType}
   */
  performComputations(data: unknown): StrategyEventType;
}

export default EventStrategy;
