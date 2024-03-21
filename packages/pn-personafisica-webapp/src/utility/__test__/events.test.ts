import { EventCategory } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../models/PFEventsType';
import PFEventStrategyFactory from '../MixpanelUtils/PFEventStrategyFactory';

describe('test track events', () => {
  it('app crash event', () => {
    const event = PFEventStrategyFactory.getStrategy(
      PFEventsType.SEND_GENERIC_ERROR
    )?.performComputations({});

    expect(event).toEqual({
      event_category: EventCategory.KO,
    });
  });
});
