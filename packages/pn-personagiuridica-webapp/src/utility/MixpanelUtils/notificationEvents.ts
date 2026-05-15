import { type TrackedEvent, uxScreenView } from '@pagopa-pn/pn-commons';

import { PGEventPayloads } from '../../models/PGEventPayloads';
import { PGEventsType } from '../../models/PGEventsType';

type NotificationTrackingConfigs = {
  [PGEventsType.SEND_PG_YOUR_NOTIFICATION]: (
    payload: PGEventPayloads[PGEventsType.SEND_PG_YOUR_NOTIFICATION]
  ) => TrackedEvent;
  [PGEventsType.SEND_PG_NOTIFICATION_DETAIL]: (
    payload: PGEventPayloads[PGEventsType.SEND_PG_NOTIFICATION_DETAIL]
  ) => TrackedEvent;
};

export const notificationTrackingConfigs: NotificationTrackingConfigs = {
  [PGEventsType.SEND_PG_YOUR_NOTIFICATION]: (payload) => uxScreenView(payload),

  [PGEventsType.SEND_PG_NOTIFICATION_DETAIL]: (payload) => uxScreenView(payload),
};
