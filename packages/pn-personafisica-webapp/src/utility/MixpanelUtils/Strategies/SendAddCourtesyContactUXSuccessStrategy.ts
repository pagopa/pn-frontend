import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type SendAddCourtesyContactProps = {
  senderId: string;
  fromSercqSend: boolean;
};

type SendAddCourtesyContactReturn = {
  other_contact: string;
  from_sercq_send: string;
};
export class SendAddCourtesyContactUXSuccessStrategy implements EventStrategy {
  performComputations({
    senderId,
    fromSercqSend,
  }: SendAddCourtesyContactProps): TrackedEvent<SendAddCourtesyContactReturn> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        other_contact: senderId !== 'default' ? 'yes' : 'no',
        from_sercq_send: fromSercqSend ? 'yes' : 'no',
      },
    };
  }
}
