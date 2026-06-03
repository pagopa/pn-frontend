import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { PAEventsType } from '../../../models/PAEventsType';
import { statisticsTrackingConfigs } from '../statisticsEvents';

describe('statisticsTrackingConfigs', () => {
  it('should build SEND_PA_STATISTICS event', () => {
    const result = statisticsTrackingConfigs[PAEventsType.SEND_PA_STATISTICS](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });
});
