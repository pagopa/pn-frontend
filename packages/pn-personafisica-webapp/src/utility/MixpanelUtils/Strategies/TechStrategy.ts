import {
  AppRouteParams,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';
import { EventNotificationSource } from '@pagopa-pn/pn-commons/src/models/MixpanelEvents';

import { appRouteParamToEventSource } from '../../notification.utility';

type Tech = {
  source?: EventNotificationSource;
};

export class TechStrategy implements EventStrategy {
  performComputations(data?: { source: AppRouteParams }): TrackedEvent<Tech> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.TECH,
        source: appRouteParamToEventSource(data?.source),
      },
    };
  }
}
