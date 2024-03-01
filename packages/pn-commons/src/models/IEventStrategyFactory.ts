import EventStrategy from '../utility/MixpanelUtils/EventStrategy';
import EventType from '../utility/MixpanelUtils/EventType';

/**
 * Description placeholder
 * @date 01/03/2024 - 17:04:43
 *
 * @export
 * @interface IEventStrategyFactory
 * @typedef {IEventStrategyFactory}
 */
export default interface IEventStrategyFactory {
  getStrategy(eventType: EventType): EventStrategy | null;
}
