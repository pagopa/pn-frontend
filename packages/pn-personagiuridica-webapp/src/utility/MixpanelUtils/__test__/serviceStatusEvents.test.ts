import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { PGEventsType } from '../../../models/PGEventsType';
import { serviceStatusTrackingConfigs } from '../serviceStatusEvents';

describe('serviceStatusTrackingConfigs', () => {
  it('should build SEND_PG_SERVICE_STATUS event', () => {
    const result = serviceStatusTrackingConfigs[PGEventsType.SEND_PG_SERVICE_STATUS](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });
});
