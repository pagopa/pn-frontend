import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { PGEventsType } from '../../../models/PGEventsType';
import { navigationTrackingConfigs } from '../navigationEvents';

const navigationEventTypes = [
  PGEventsType.SEND_PG_OPEN_USERS,
  PGEventsType.SEND_PG_OPEN_GROUPS,
  PGEventsType.SEND_PG_HELP,
  PGEventsType.SEND_PG_EXIT,
] as const;

describe('navigationTrackingConfigs', () => {
  it.each(navigationEventTypes)('should build %s event', (EventType) => {
    const result = navigationTrackingConfigs[EventType](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });
});
