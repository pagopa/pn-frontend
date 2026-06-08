import EventStrategy from '../../models/EventStrategy';
import { EventPropertyType } from '../../models/MixpanelEvents';
import { TrackEventOptions, trackEvent } from '../../services/tracking.service';

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
 * @template T - Application event names.
 * @template P - Event payload map. Defaults to Record<T, unknown> for legacy compatibility.
 *
 * TODO: PN-19759 - P defaults to Record<T, unknown> to preserve compatibility with PF
 * which is currently the only package using the legacy class-based Mixpanel strategies.
 * Once PF is migrated to the typed functional registry approach, evaluate making
 * the payload map mandatory and typing EventStrategy.performComputations() as well,
 * so the remaining legacy unknown typing can be removed.
 */

export default abstract class EventStrategyFactory<
  T extends string,
  P extends Record<T, unknown> = Record<T, unknown>
> {
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
   * @param {K} eventType
   * @param {P[K]} [data]
   * @param {TrackEventOptions} [options]
   */
  public triggerEvent<K extends T>(eventType: K, data?: P[K], options?: TrackEventOptions) {
    try {
      const strategy = this.getStrategy(eventType);

      if (!strategy) {
        throw new Error('Unknown event type ' + eventType);
      }

      const eventParameters = strategy.performComputations(data);

      for (const [type, parameters] of Object.entries(eventParameters)) {
        trackEvent(
          type as EventPropertyType,
          eventType,
          process.env.NODE_ENV!,
          parameters,
          options
        );
      }
    } catch (error) {
      console.error('MIXPANEL - Tracking error: ', eventType, error);

      if (typeof options === 'function') {
        options(0);
      } else {
        options?.callback?.();
      }
    }
  }
}
