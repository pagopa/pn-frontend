import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendAddSercqSendAddSmsStartStrategy } from '../SendAddSercqSendAddSmsStartStrategy';

describe('Mixpanel - Add SERCQ Sms Start Strategy', () => {
  it('should return add SERCQ Sms start event', () => {
    const strategy = new SendAddSercqSendAddSmsStartStrategy();

    const smsStartEvent = strategy.performComputations({
      sms_validation: 'valid',
    });

    expect(smsStartEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        sms_validation: 'valid',
      },
    });
  });
});
