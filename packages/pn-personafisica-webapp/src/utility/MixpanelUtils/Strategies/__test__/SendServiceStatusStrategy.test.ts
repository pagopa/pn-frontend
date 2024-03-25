import { EventAction, EventCategory } from '@pagopa-pn/pn-commons';

import { SendServiceStatusStrategy } from '../SendServiceStatusStrategy';

describe('Mixpanel - Service status Strategy', () => {
  it('should return service status event', () => {
    const strategy = new SendServiceStatusStrategy();

    const serviceStatusOKEvent = strategy.performComputations(true);
    expect(serviceStatusOKEvent).toEqual({
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      service_status_OK: true,
    });

    const serviceStatusKOEvent = strategy.performComputations(false);
    expect(serviceStatusKOEvent).toEqual({
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      service_status_OK: false,
    });
  });
});
