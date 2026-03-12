import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type Props = {
  status: 'display' | 'error';
};

export class SendNotificationExpensesDetailStrategy implements EventStrategy {
  performComputations({ status }: Props): TrackedEvent<Props> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        status,
      },
    };
  }
}
