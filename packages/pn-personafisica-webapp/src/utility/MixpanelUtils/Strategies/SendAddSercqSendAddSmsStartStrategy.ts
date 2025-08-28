import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type Props = {
  sms_validation: 'valid' | 'invalid' | 'missing';
};

export class SendAddSercqSendAddSmsStartStrategy implements EventStrategy {
  performComputations({ sms_validation }: Props): TrackedEvent<Props> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        sms_validation,
      },
    };
  }
}
