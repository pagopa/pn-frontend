import { EventStrategy, EventStrategyFactory } from '@pagopa-pn/pn-commons';

import { PFLoginEventsType } from '../../models/PFLoginEventsType';
import { SendIDPSelectedStrategy } from './Strategies/SendIDPSelectedStrategy';
import { SendLoginFailureStrategy } from './Strategies/SendLoginFailureStrategy';
import { SendLoginMethodStrategy } from './Strategies/SendLoginMethodStrategy';
import { UXScreenViewStrategy } from './Strategies/UXScreenViewStrategy';

class PFLoginEventStrategyFactory extends EventStrategyFactory<PFLoginEventsType> {
  getStrategy(eventType: PFLoginEventsType): EventStrategy | null {
    switch (eventType) {
      case PFLoginEventsType.SEND_LOGIN:
        return new UXScreenViewStrategy();
      case PFLoginEventsType.SEND_IDP_SELECTED:
        return new SendIDPSelectedStrategy();
      case PFLoginEventsType.SEND_LOGIN_FAILURE:
        return new SendLoginFailureStrategy();
      case PFLoginEventsType.SEND_LOGIN_METHOD:
        return new SendLoginMethodStrategy();
      default:
        return null;
    }
  }
}

export default new PFLoginEventStrategyFactory();
