import { EventType, IEventStrategyFactory } from '@pagopa-pn/pn-commons';
import EventStrategy from '@pagopa-pn/pn-commons/src/utility/MixpanelUtils/EventStrategy';

import { PFEventsType } from './PFEventsType';
import { SendProfileStrategy } from './Strategies/profile';

export class PFEventStrategyFactory implements IEventStrategyFactory {
  getStrategy(eventType: EventType): EventStrategy | null {
    switch (eventType) {
      case PFEventsType.SEND_PROFILE:
        return new SendProfileStrategy();
      default:
        return null;
    }
  }
}
