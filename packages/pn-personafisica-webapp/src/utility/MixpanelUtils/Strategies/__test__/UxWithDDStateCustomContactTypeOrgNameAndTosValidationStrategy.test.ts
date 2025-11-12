import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { digitalLegalAddresses } from '../../../../__mocks__/Contacts.mock';
import { ChannelType } from '../../../../models/contacts';
import { UxWithDDStateCustomContactTypeOrgNameAndTosValidationStrategy } from '../UxWithDDStateCustomContactTypeOrgNameAndTosValidationStrategy';

describe('Mixpanel - UX Action with Digital Domicil State, customized contact type, organization name and tos validation Strategy', () => {
  const strategy = new UxWithDDStateCustomContactTypeOrgNameAndTosValidationStrategy();
  it('should return digital_domicile_state, customized contact type as PEC, organization name not null and tos valid', () => {
    const result = strategy.performComputations({
      event_type: EventAction.SCREEN_VIEW,
      addresses: digitalLegalAddresses,
      customized_contact_type: ChannelType.PEC,
      organization_name: 'Agenzia delle Entrate',
      tos_validation: 'valid',
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        digital_domicile_state: 'pec',
        customized_contact_type: 'pec',
        organization_name: 'Agenzia delle Entrate',
        tos_validation: 'valid',
      },
    });
  });

  it('should return digital_domicile_state, customized contact type as SERCQ, organization name not null and tos missing', () => {
    const result = strategy.performComputations({
      event_type: EventAction.SCREEN_VIEW,
      addresses: digitalLegalAddresses,
      customized_contact_type: ChannelType.SERCQ_SEND,
      organization_name: 'Agenzia delle Entrate',
      tos_validation: 'missing',
    });

    expect(result).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        digital_domicile_state: 'pec',
        customized_contact_type: 'send',
        organization_name: 'Agenzia delle Entrate',
        tos_validation: 'missing',
      },
    });
  });
});
