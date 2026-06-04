import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { PGEventsType } from '../../../models/PGEventsType';
import { mandateTrackingConfigs } from '../mandateEvents';

describe('mandateTrackingConfigs', () => {
  it('should build SEND_PG_ADD_MANDATE_START action event', () => {
    const result = mandateTrackingConfigs[PGEventsType.SEND_PG_ADD_MANDATE_START](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });

  it('shold build SEND_PG_ADD_MANDATE_UX_SUCCESS confirm event', () => {
    const result = mandateTrackingConfigs[PGEventsType.SEND_PG_ADD_MANDATE_UX_SUCCESS](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
      },
    });
  });
});
