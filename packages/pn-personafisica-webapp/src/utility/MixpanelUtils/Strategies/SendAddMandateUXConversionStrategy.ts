import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  RecipientType,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type SendAddMandateUXConversion = {
  selectPersonaFisicaOrPersonaGiuridica: RecipientType;
  selectTuttiEntiOrSelezionati: string;
};

type SendAddMandateUXConversionReturn = {
  person_type: RecipientType;
  mandate_type: string;
};

export class SendAddMandateUXConversionStrategy implements EventStrategy {
  performComputations(
    data: SendAddMandateUXConversion
  ): TrackedEvent<SendAddMandateUXConversionReturn> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        person_type: data.selectPersonaFisicaOrPersonaGiuridica,
        mandate_type:
          data.selectTuttiEntiOrSelezionati === 'tuttiGliEnti' ? 'all' : 'selected_party',
      },
    };
  }
}
