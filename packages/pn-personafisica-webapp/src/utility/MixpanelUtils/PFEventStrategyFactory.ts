import { EventStrategy, EventStrategyFactory } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../models/PFEventsType';
import { SendProfileStrategy } from './Strategies/profile';

class PFEventStrategyFactory extends EventStrategyFactory<PFEventsType> {
  getStrategy(eventType: PFEventsType): EventStrategy | null {
    switch (eventType) {
      case PFEventsType.SEND_PROFILE:
        return new SendProfileStrategy();
      default:
        return null;
    }
  }
}

export default new PFEventStrategyFactory();
