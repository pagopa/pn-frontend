import { uxAction } from '@pagopa-pn/pn-commons';

import { PGEventsType } from '../../models/PGEventsType';
import { TrackingConfigs } from './trackingTypes';

type NavigationEventType =
  | PGEventsType.SEND_PG_EXIT
  | PGEventsType.SEND_PG_HELP
  | PGEventsType.SEND_PG_OPEN_GROUPS
  | PGEventsType.SEND_PG_OPEN_USERS;

export const navigationTrackingConfigs: TrackingConfigs<NavigationEventType> = {
  [PGEventsType.SEND_PG_EXIT]: () => uxAction(),
  [PGEventsType.SEND_PG_HELP]: () => uxAction(),
  [PGEventsType.SEND_PG_OPEN_GROUPS]: () => uxAction(),
  [PGEventsType.SEND_PG_OPEN_USERS]: () => uxAction(),
};
