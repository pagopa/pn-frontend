import {
  AppRouteParams,
  EventCategory,
  EventNotificationSource,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { appRouteParamToEventSource } from '../../notification.utility';

type Return = {
  source?: EventNotificationSource;
};

type Props = {
  source?: AppRouteParams;
};

export class TechRapidAccessStrategy implements EventStrategy {
  performComputations({ source }: Props): TrackedEvent<Return> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.TECH,
        source: appRouteParamToEventSource(source),
      },
    };
  }
}
