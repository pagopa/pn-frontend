import {
  EventAction,
  EventCategory,
  EventStrategy,
  RecipientType,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type SendAddMandateUXConversion = {
  person_type: RecipientType;
  mandate_type: string;
};

export class SendAddMandateUXConversionStrategy implements EventStrategy {
  performComputations(data: SendAddMandateUXConversion): TrackedEvent<SendAddMandateUXConversion> {
    return {
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      ...data,
    };
  }
}
