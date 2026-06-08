import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendIDPNotAvailableStrategy } from '../SendIDPNotAvailableStrategy';

describe('Mixpanel - Send IDP Not Available Strategy', () => {
  it('should return IDP not available event', () => {
    const strategy = new SendIDPNotAvailableStrategy();
    const event = strategy.performComputations({
      SPID_IDP_ID: 'idp_id',
      SPID_IDP_NAME: 'idp_name',
    });

    expect(event).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.KO,
        event_type: EventAction.ERROR,
        SPID_IDP_ID: 'idp_id',
        SPID_IDP_NAME: 'idp_name',
      },
    });
  });
});
