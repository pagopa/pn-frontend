import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { PAEventsType } from '../../../models/PAEventsType';
import { apiKeyTrackingConfigs } from '../apiKeyEvents';

describe('apiKeyTrackingConfigs', () => {
  it('should build SEND_PA_API_INTEGRATIONS event', () => {
    const result = apiKeyTrackingConfigs[PAEventsType.SEND_PA_API_INTEGRATIONS](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });

  it('should build SEND_PA_ADD_API_START event', () => {
    const result = apiKeyTrackingConfigs[PAEventsType.SEND_PA_ADD_API_START](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });

  it('should build SEND_PA_ADD_API_UX_SUCCESS event', () => {
    const result = apiKeyTrackingConfigs[PAEventsType.SEND_PA_ADD_API_UX_SUCCESS](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
      },
    });
  });
});
