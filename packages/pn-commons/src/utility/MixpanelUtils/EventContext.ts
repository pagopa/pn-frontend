import { EventType, IEventStrategyFactory, trackEvent } from '@pagopa-pn/pn-commons';

import EventStrategyFactory from './EventStrategyFactory';

class EventContext {
  private static instance: EventContext;
  private factory: IEventStrategyFactory;
  private commonFactory: IEventStrategyFactory;

  private constructor() {
    if (EventContext.instance) {
      return EventContext.instance;
    }

    EventContext.instance = this;
    this.commonFactory = new EventStrategyFactory();
  }

  public static getInstance(): EventContext {
    if (!EventContext.instance) {
      // eslint-disable-next-line functional/immutable-data
      EventContext.instance = new EventContext();
    }
    return EventContext.instance;
  }

  public setStrategy(factory: IEventStrategyFactory) {
    // eslint-disable-next-line functional/immutable-data
    this.factory = factory;
  }

  public triggerEvent(eventType: EventType, data?: unknown) {
    // eslint-disable-next-line functional/no-let
    let strategy = this.commonFactory.getStrategy(eventType);

    if (!strategy) {
      strategy = this.factory.getStrategy(eventType);
    }

    if (!strategy) {
      throw new Error('Unknown event type ' + eventType.toString());
    }

    const eventParameters = strategy.performComputations(data);

    trackEvent(eventType, process.env.NODE_ENV!, eventParameters);
  }
}

const eventContext = EventContext.getInstance();

export default eventContext;
