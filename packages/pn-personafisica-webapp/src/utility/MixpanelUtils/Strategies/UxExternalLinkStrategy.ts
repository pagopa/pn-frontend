import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';
import { EventNotificationType } from '@pagopa-pn/pn-commons/src/models/MixpanelEvents';

type Props = {
  link: string;
  notification_type: EventNotificationType;
};

export class UxExternalLinkStrategy implements EventStrategy {
  performComputations({ link, notification_type }: Props): TrackedEvent<Props> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.EXIT,
        link,
        notification_type,
      },
    };
  }
}
