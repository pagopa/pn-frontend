import { type EventStrategy, EventStrategyFactory } from '@pagopa-pn/pn-commons';

import type { PAEventPayloads } from '../../models/PAEventPayloads';
import { PAEventsType } from '../../models/PAEventsType';
import { getPATrackingConfig } from './trackingRegistry';

class PAEventStrategyFactory extends EventStrategyFactory<PAEventsType, PAEventPayloads> {
  getStrategy(eventType: PAEventsType): EventStrategy | null {
    return this.getTypedStrategy(eventType);
  }

  private getTypedStrategy<K extends PAEventsType>(eventType: K): EventStrategy | null {
    const computeFunction = getPATrackingConfig(eventType);

    if (!computeFunction) {
      return null;
    }

    return {
      /*
       * TODO: PN-19760 - This adapter keeps PA typed registry handlers compatible
       * with the current legacy EventStrategy contract, where performComputations
       * still receives unknown data to preserve the existing PF class-based strategies.
       */
      performComputations: (data: unknown) => computeFunction(data as PAEventPayloads[K]),
    };
  }
}

export default new PAEventStrategyFactory();
