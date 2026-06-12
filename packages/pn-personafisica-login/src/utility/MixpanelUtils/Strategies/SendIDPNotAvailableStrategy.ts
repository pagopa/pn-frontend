import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type SendIDPNotAvilableParams = {
  SPID_IDP_ID: string;
  SPID_IDP_NAME: string;
};

export class SendIDPNotAvailableStrategy implements EventStrategy {
  performComputations({
    SPID_IDP_ID,
    SPID_IDP_NAME,
  }: SendIDPNotAvilableParams): TrackedEvent<SendIDPNotAvilableParams> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.KO,
        event_type: EventAction.ERROR,
        SPID_IDP_ID,
        SPID_IDP_NAME,
      },
    };
  }
}
