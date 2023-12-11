import { EventCategory } from '@pagopa-pn/pn-commons';

import { TrackEventType, events } from '../events';

describe('test track events', () => {
  it('app crash event', () => {
    const event = events[TrackEventType.SEND_GENERIC_ERROR];
    expect(event).toEqual({
      event_category: EventCategory.KO,
    });
  });

  it('undefined event', () => {
    const event = events['TEST'];
    expect(event).toEqual(undefined);
  });
});
