import { EventAction, EventCategory, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

type SendNotificationStatusDetail = {
  accordion: 'collapse' | 'expand';
};

export class SendNotificationStatusDetailStrategy implements EventStrategy {
  performComputations({
    accordion,
  }: SendNotificationStatusDetail): TrackedEvent<SendNotificationStatusDetail> {
    return {
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      accordion,
    };
  }
}
