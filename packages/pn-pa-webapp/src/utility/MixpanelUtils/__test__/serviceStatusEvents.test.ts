import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { PAEventsType } from '../../../models/PAEventsType';
import { serviceStatusTrackingConfigs } from '../serviceStatusEvents';

describe('serviceStatusTrackingConfigs', () => {
  it('should build SEND_PA_SERVICE_STATUS event', () => {
    const result = serviceStatusTrackingConfigs[PAEventsType.SEND_PA_SERVICE_STATUS](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });
});
