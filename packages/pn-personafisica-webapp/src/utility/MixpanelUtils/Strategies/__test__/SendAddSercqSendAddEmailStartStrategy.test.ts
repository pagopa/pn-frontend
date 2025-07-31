import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendAddSercqSendAddEmailStartStrategy } from '../SendAddSercqSendAddEmailStartStrategy';

describe('Mixpanel - Add SERCQ Email Start Strategy', () => {
  it('should return add SERCQ email start event', () => {
    const strategy = new SendAddSercqSendAddEmailStartStrategy();

    const emailStartEvent = strategy.performComputations({
      email_validation: 'valid',
    });

    expect(emailStartEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        email_validation: 'valid',
      },
    });
  });
});
