import { EventType } from '../../models/EventType';
import EventStrategyFactory from './EventStrategyFactory';

/**
 * The EventStrategyFactory for the pn-commons library.
 *
 * @date 20/3/2024 - 10:20:28
 *
 * @class CommonEventStrategyFactory
 * @typedef {CommonEventStrategyFactory}
 * @extends {EventStrategyFactory<EventType>}
 * @see EventStrategyFactory
 */
class CommonEventStrategyFactory extends EventStrategyFactory<EventType> {
  /**
   * The strategy management specific for all those events that must be tracked in pn-commons library.
   *
   * @date 20/3/2024 - 10:20:33
   *
   * @param {EventType} eventType
   * @returns {*}
   */
  getStrategy(eventType: EventType) {
    switch (eventType) {
      default:
        return null;
    }
  }
}

export default new CommonEventStrategyFactory();
