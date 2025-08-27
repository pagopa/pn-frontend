import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { SendAddSercqPecStartActivationStrategy } from '../SendAddSercqPecStartActivationStrategy';

describe('Mixpanel - Add SERCQ Pec Start Activation Strategy', () => {
  it('should return add SERCQ pec start activation event', () => {
    const strategy = new SendAddSercqPecStartActivationStrategy();

    const pecStartValidationEvent = strategy.performComputations({
      pec_validation: 'valid',
      tos_validation: 'missing',
    });
    expect(pecStartValidationEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        pec_validation: 'valid',
        tos_validation: 'missing',
      },
    });
  });
});
