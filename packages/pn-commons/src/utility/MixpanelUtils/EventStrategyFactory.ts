import EventStrategy from '../../models/EventStrategy';
import { EventPropertyType } from '../../models/MixpanelEvents';
import { trackEvent } from '../../services/tracking.service';

/**
 * The abstract factory that must be extended by each application to define
 * its own factory for event tracking management.
 *
 * @date 20/3/2024 - 10:16:08
 *
 * @export
 * @abstract
 * @class EventStrategyFactory
 * @typedef {EventStrategyFactory}
 * @template {string} T
 */
export default abstract class EventStrategyFactory<T extends string> {
  /**
   * This method must be implemented by each applications.
   * It defines the event strategy management.
   *
   * @date 20/3/2024 - 10:14:37
   *
   * @abstract
   * @param {T} eventType
   * @returns {(EventStrategy | null)}
   * @see EventStrategy
   */
  abstract getStrategy(eventType: T): EventStrategy | null;

  /**
   * This is the method that, given a specific event, gets the strategy, does the needed computations
   * and track the event.
   * It must not be overwritten unless strictly necessary.
   *
   * @date 20/3/2024 - 10:18:02
   *
   * @public
   * @param {T} eventType
   * @param {?unknown} [data]
   */
  public triggerEvent(eventType: T, data?: unknown) {
    const strategy = this.getStrategy(eventType);

    if (!strategy) {
      throw new Error('Unknown event type ' + eventType);
    }

    const eventParameters = strategy.performComputations(data);

    for (const [type, parameters] of Object.entries(eventParameters)) {
      trackEvent(type as EventPropertyType, eventType, process.env.NODE_ENV!, parameters);
    }
  }
}
