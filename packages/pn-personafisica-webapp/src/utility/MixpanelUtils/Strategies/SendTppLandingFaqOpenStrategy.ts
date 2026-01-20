import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type FaqNameProps = {
  faq_name: string;
};

export class SendTppLandingFaqOpenStrategy implements EventStrategy {
  performComputations({ faq_name }: FaqNameProps): TrackedEvent<FaqNameProps> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        faq_name,
      },
    };
  }
}
