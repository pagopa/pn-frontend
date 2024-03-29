import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type SendIDPSelected = {
  SPID_IDP_NAME: string;
  SPID_IDP_ID: string;
};

export class SendIDPSelectedStrategy implements EventStrategy {
  performComputations({
    SPID_IDP_ID,
    SPID_IDP_NAME,
  }: SendIDPSelected): TrackedEvent<SendIDPSelected> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        SPID_IDP_ID,
        SPID_IDP_NAME,
      },
    };
  }
}
