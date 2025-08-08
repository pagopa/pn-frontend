import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type Props = {
  tos_validation: 'valid' | 'missing';
};

export class SendAddSercqSendUxConversionStrategy implements EventStrategy {
  performComputations({ tos_validation }: Props): TrackedEvent<Props> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        tos_validation,
      },
    };
  }
}
