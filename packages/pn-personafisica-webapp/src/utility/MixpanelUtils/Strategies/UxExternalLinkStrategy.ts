import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type Props = {
  link: string;
};

export class UxExternalLinkStrategy implements EventStrategy {
  performComputations({ link }: Props): TrackedEvent<Props> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.EXIT,
        link,
      },
    };
  }
}
