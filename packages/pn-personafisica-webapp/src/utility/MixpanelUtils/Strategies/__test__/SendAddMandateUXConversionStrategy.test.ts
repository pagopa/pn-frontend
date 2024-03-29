import {
  EventAction,
  EventCategory,
  EventPropertyType,
  RecipientType,
} from '@pagopa-pn/pn-commons';

import { SendAddMandateUXConversionStrategy } from '../SendAddMandateUXConversionStrategy';

describe('Mixpanel - Add mandate UX conversion Strategy', () => {
  it('should return add mandate UX conversion event', () => {
    const recipientType = RecipientType.PF;
    const strategy = new SendAddMandateUXConversionStrategy();

    const allMandateTypeEvent = strategy.performComputations({
      selectPersonaFisicaOrPersonaGiuridica: recipientType,
      selectTuttiEntiOrSelezionati: 'tuttiGliEnti',
    });
    expect(allMandateTypeEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        person_type: recipientType,
        mandate_type: 'all',
      },
    });

    const selectedPartyEvent = strategy.performComputations({
      selectPersonaFisicaOrPersonaGiuridica: recipientType,
      selectTuttiEntiOrSelezionati: 'comune di milano',
    });
    expect(selectedPartyEvent).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        person_type: recipientType,
        mandate_type: 'selected_party',
      },
    });
  });
});
