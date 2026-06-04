import { type EventStrategy, EventStrategyFactory } from '@pagopa-pn/pn-commons';

import { PGEventPayloads } from '../../models/PGEventPayloads';
import { PGEventsType } from '../../models/PGEventsType';
import { getPGTrackingConfig } from './trackingRegistry';

class PGEventStrategyFactory extends EventStrategyFactory<PGEventsType, PGEventPayloads> {
  getStrategy(eventType: PGEventsType): EventStrategy | null {
    return this.getTypedStrategy(eventType);
  }

  private getTypedStrategy<K extends PGEventsType>(eventType: K): EventStrategy | null {
    const computeFunction = getPGTrackingConfig(eventType);

    if (!computeFunction) {
      return null;
    }

    return {
      /*
       * TODO: PN-19759 - This adapter keeps PG typed registry handlers compatible
       * with the current legacy EventStrategy contract, where performComputations
       * still receives unknown data to preserve the existing PF class-based strategies.
       */
      performComputations: (data: unknown) => computeFunction(data as PGEventPayloads[K]),
    };
  }
}

export default new PGEventStrategyFactory();
