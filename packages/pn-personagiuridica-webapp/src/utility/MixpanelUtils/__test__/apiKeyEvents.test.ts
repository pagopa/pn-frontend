import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { PGEventsType } from '../../../models/PGEventsType';
import { apiKeyTrackingConfigs } from '../apiKeyEvents';

describe('apiKeyTrackingConfigs', () => {
  it('should build SEND_PG_API_INTEGRATION event', () => {
    const result = apiKeyTrackingConfigs[PGEventsType.SEND_PG_API_INTEGRATION](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });

  it('should build SEND_PG_ADD_API_START event', () => {
    const result = apiKeyTrackingConfigs[PGEventsType.SEND_PG_ADD_API_START]({
      API_type: 'personal',
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        API_type: 'personal',
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });

  it('should build SEND_PG_ADD_API_UX_SUCCESS event', () => {
    const result = apiKeyTrackingConfigs[PGEventsType.SEND_PG_ADD_API_UX_SUCCESS]({
      API_type: 'public',
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        API_type: 'public',
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
      },
    });
  });
});
