import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { digitalAddressesSercq, digitalLegalAddresses } from '../../../../__mocks__/Contacts.mock';
import { UxWithDDStateTosAndPecValidationStrategy } from '../UxWithDDStateTosAndPecValidationStrategy';

describe('Mixpanel - UX Action with Digital Domicil State, tos and pec validation Strategy', () => {
  const strategy = new UxWithDDStateTosAndPecValidationStrategy();
  it('should return digital_domicile_state, tos valid and pec valid', () => {
    const result = strategy.performComputations({
      event_type: EventAction.SCREEN_VIEW,
      legal_addresses: digitalLegalAddresses,
      pec_validation: 'valid',
      tos_validation: 'valid',
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        digital_domicile_state: 'pec',
        pec_validation: 'valid',
        tos_validation: 'valid',
      },
    });
  });

  it('should return digital_domicile_state, tos missing and pec valid', () => {
    const result = strategy.performComputations({
      event_type: EventAction.ACTION,
      legal_addresses: digitalLegalAddresses,
      pec_validation: 'valid',
      tos_validation: 'missing',
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        digital_domicile_state: 'pec',
        pec_validation: 'valid',
        tos_validation: 'missing',
      },
    });
  });

  it('should return digital_domicile_state, tos valid and pec missing', () => {
    const result = strategy.performComputations({
      event_type: EventAction.ACTION,
      legal_addresses: digitalAddressesSercq,
      pec_validation: 'missing',
      tos_validation: 'valid',
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        digital_domicile_state: 'send',
        pec_validation: 'missing',
        tos_validation: 'valid',
      },
    });
  });

  it('should return digital_domicile_state, tos valid and pec invalid', () => {
    const result = strategy.performComputations({
      event_type: EventAction.ACTION,
      legal_addresses: digitalAddressesSercq,
      pec_validation: 'invalid',
      tos_validation: 'valid',
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        digital_domicile_state: 'send',
        pec_validation: 'invalid',
        tos_validation: 'valid',
      },
    });
  });
});
