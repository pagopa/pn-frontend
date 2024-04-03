import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendIDPSelectedStrategy } from '../SendIDPSelectedStrategy';

describe('Mixpanel - Send IDP Selected Strategy', () => {
  it('should return IDP selected event', () => {
    const strategy = new SendIDPSelectedStrategy();
    const event = strategy.performComputations({
      SPID_IDP_ID: 'idp_id',
      SPID_IDP_NAME: 'idp_name',
    });

    expect(event).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        SPID_IDP_ID: 'idp_id',
        SPID_IDP_NAME: 'idp_name',
      },
    });
  });
});
