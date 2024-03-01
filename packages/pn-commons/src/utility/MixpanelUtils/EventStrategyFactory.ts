import IEventStrategyFactory from '../../models/IEventStrategyFactory';
import EventType from './EventType';

/**
 * Description placeholder
 * @date 23/2/2024 - 17:30:05
 *
 * @export
 * @class EventStrategyFactory
 * @typedef {EventStrategyFactory}
 * @implements {IEventStrategyFactory<EventType>}
 */
export default class EventStrategyFactory implements IEventStrategyFactory {
  /**
   * Description placeholder
   * @date 23/2/2024 - 17:29:49
   *
   * @param {EventType} eventType
   * @returns {*}
   */
  getStrategy(eventType: EventType) {
    switch (eventType) {
      case EventType.PAGE_VIEW:
        return new PageViewStrategy();
      case EventType.BUTTON_CLICK:
        return new ButtonClickStrategy();
      default:
        return null;
    }
  }
}
