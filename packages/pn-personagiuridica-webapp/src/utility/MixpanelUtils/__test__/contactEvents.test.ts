import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import type { PGEventPayloads } from '../../../models/PGEventPayloads';
import { PGEventsType } from '../../../models/PGEventsType';
import { ChannelType } from '../../../models/contacts';
import { contactTrackingConfigs } from '../contactEvents';

describe('contactTrackingConfigs', () => {
  it('should build SEND_PG_YOUR_CONTACT_DETAILS screen view event', () => {
    const payload: PGEventPayloads[PGEventsType.SEND_PG_YOUR_CONTACT_DETAILS] = {
      digital_domicile_exists: true,
      digital_domicile_type: ChannelType.SERCQ_SEND,
      email_exists: true,
      telephone_exists: false,
    };

    const result = contactTrackingConfigs[PGEventsType.SEND_PG_YOUR_CONTACT_DETAILS](payload);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        ...payload,
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });
});
