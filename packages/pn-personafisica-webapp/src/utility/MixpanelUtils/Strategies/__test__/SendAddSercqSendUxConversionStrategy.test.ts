import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { digitalAddressesSercq } from '../../../../__mocks__/Contacts.mock';
import { SendAddSercqSendUxConversionStrategy } from '../SendAddSercqSendUxConversionStrategy';

describe('Mixpanel - Add SERCQ SEND UX Conversion Strategy', () => {
  it('should return add SERCQ SEND UX conversion event', () => {
    const strategy = new SendAddSercqSendUxConversionStrategy();

    const assSercqSendValidationEvent = strategy.performComputations({
      tos_validation: 'missing',
      legal_addresses: digitalAddressesSercq,
    });

    expect(assSercqSendValidationEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        tos_validation: 'missing',
        digital_domicile_state: 'send',
      },
    });
  });
});
