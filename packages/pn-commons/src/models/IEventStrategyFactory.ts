import EventStrategy from '../utility/MixpanelUtils/EventStrategy';

export default interface IEventStrategyFactory<T> {
  getStrategy(eventType: T): EventStrategy | null;
}
