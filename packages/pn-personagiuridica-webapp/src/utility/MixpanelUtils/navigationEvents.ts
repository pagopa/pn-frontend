import { TrackedEvent, uxAction } from '@pagopa-pn/pn-commons';

import { PGEventPayloads } from '../../models/PGEventPayloads';
import { PGEventsType } from '../../models/PGEventsType';

type NavigationTrackingConfig = {
  [PGEventsType.SEND_PG_EXIT]: (
    payload: PGEventPayloads[PGEventsType.SEND_PG_EXIT]
  ) => TrackedEvent;
  [PGEventsType.SEND_PG_HELP]: (
    payload: PGEventPayloads[PGEventsType.SEND_PG_HELP]
  ) => TrackedEvent;
  [PGEventsType.SEND_PG_OPEN_GROUPS]: (
    payload: PGEventPayloads[PGEventsType.SEND_PG_OPEN_GROUPS]
  ) => TrackedEvent;
  [PGEventsType.SEND_PG_OPEN_USERS]: (
    payload: PGEventPayloads[PGEventsType.SEND_PG_OPEN_USERS]
  ) => TrackedEvent;
};

export const navigationTrackingConfigs: NavigationTrackingConfig = {
  [PGEventsType.SEND_PG_EXIT]: () => uxAction(),
  [PGEventsType.SEND_PG_HELP]: () => uxAction(),
  [PGEventsType.SEND_PG_OPEN_GROUPS]: () => uxAction(),
  [PGEventsType.SEND_PG_OPEN_USERS]: () => uxAction(),
};
