import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type SendHasAddresses = {
  SEND_HAS_PEC?: 'no';
};

export class SendAddSercqSendUxSuccessStrategy implements EventStrategy {
  performComputations(
    removePec: boolean
  ): TrackedEvent<{ other_contact: 'yes' | 'no' } | SendHasAddresses> {
    const retVal = {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.CONFIRM,
        other_contact: 'no',
      },
    };

    if (removePec) {
      return {
        ...retVal,
        [EventPropertyType.PROFILE]: {
          SEND_HAS_PEC: 'no',
        },
        [EventPropertyType.SUPER_PROPERTY]: {
          SEND_HAS_PEC: 'no',
        },
      };
    }
    return retVal;
  }
}
