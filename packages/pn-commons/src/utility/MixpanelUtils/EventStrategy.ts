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
   * @date 01/03/2024 - 17:34:29
   *
   * @param data - The incoming data associated to event X
   * @returns - The event object to be track
   */
  performComputations(data: unknown): unknown;
}

export default EventStrategy;
