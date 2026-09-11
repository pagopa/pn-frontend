import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';
import { EventNotificationType } from '@pagopa-pn/pn-commons/src/models/MixpanelEvents';

type UXPspActionData = {
  psp: 'pagopa' | string;
  notification_type: EventNotificationType;
};

export class UXPspActionStrategy implements EventStrategy {
  performComputations({ psp, notification_type }: UXPspActionData): TrackedEvent<UXPspActionData> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        psp,
        notification_type,
      },
    };
  }
}
