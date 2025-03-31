import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type SendHasAddresses = {
  SEND_HAS_SERCQ_SEND?: 'no';
};
export class SendAddLegalContactUXSuccessStrategy implements EventStrategy {
  performComputations(
    removeSercqSend: boolean
  ): TrackedEvent<{ other_contact: string } | SendHasAddresses> {
    const retVal = {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        other_contact: 'no',
      },
    };

    if (removeSercqSend) {
      return {
        ...retVal,
        [EventPropertyType.PROFILE]: {
          SEND_HAS_SERCQ_SEND: 'no',
        },
        [EventPropertyType.SUPER_PROPERTY]: {
          SEND_HAS_SERCQ_SEND: 'no',
        },
      };
    }
    return retVal;
  }
}
