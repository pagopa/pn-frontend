import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type Props = {
  email_validation: 'valid' | 'invalid' | 'missing';
};

export class SendAddSercqSendAddEmailStartStrategy implements EventStrategy {
  performComputations({ email_validation }: Props): TrackedEvent<Props> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        email_validation,
      },
    };
  }
}
