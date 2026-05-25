import { uxScreenView } from '@pagopa-pn/pn-commons';

import { PGEventsType } from '../../models/PGEventsType';
import { TrackingConfigs } from './trackingTypes';

type NotificationEventType =
  | PGEventsType.SEND_PG_NOTIFICATION_DELEGATED
  | PGEventsType.SEND_PG_NOTIFICATION_DETAIL
  | PGEventsType.SEND_PG_YOUR_NOTIFICATION;

export const notificationTrackingConfigs: TrackingConfigs<NotificationEventType> = {
  [PGEventsType.SEND_PG_NOTIFICATION_DELEGATED]: (payload) => uxScreenView(payload),
  [PGEventsType.SEND_PG_NOTIFICATION_DETAIL]: (payload) => uxScreenView(payload),
  [PGEventsType.SEND_PG_YOUR_NOTIFICATION]: (payload) => uxScreenView(payload),
};
