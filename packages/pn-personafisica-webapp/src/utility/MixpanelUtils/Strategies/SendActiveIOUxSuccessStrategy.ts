import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

export class SendActiveIOUxSuccessStrategy implements EventStrategy {
  performComputations(fromSercqSend: boolean): TrackedEvent<{ from_sercq_send: string }> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        from_sercq_send: fromSercqSend ? 'yes' : 'no',
      },
    };
  }
}
