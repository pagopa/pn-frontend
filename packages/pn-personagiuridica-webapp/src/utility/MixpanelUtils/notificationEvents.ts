import { uxAction, uxScreenView } from '@pagopa-pn/pn-commons';

import { PGEventsType } from '../../models/PGEventsType';
import { TrackingConfigs } from './trackingTypes';

type NotificationEventType =
  | PGEventsType.SEND_PG_NOTIFICATION_DELEGATED
  | PGEventsType.SEND_PG_NOTIFICATION_DETAIL
  | PGEventsType.SEND_PG_YOUR_NOTIFICATION
  | PGEventsType.SEND_PG_NOTIFICATION_DOWNLOAD_ATTACHMENT
  | PGEventsType.SEND_PG_START_PAYMENT
  | PGEventsType.SEND_PG_TIMELINE_SHOW_HISTORY
  | PGEventsType.SEND_PG_TIMELINE_SHOW_MORE
  | PGEventsType.SEND_PG_TIMELINE_DOWNLOAD;

export const notificationTrackingConfigs: TrackingConfigs<NotificationEventType> = {
  [PGEventsType.SEND_PG_NOTIFICATION_DELEGATED]: (payload) => uxScreenView(payload),
  [PGEventsType.SEND_PG_NOTIFICATION_DETAIL]: (payload) => uxScreenView(payload),
  [PGEventsType.SEND_PG_YOUR_NOTIFICATION]: (payload) => uxScreenView(payload),
  [PGEventsType.SEND_PG_NOTIFICATION_DOWNLOAD_ATTACHMENT]: (payload) => uxAction(payload),
  [PGEventsType.SEND_PG_START_PAYMENT]: (payload) => uxAction(payload),
  [PGEventsType.SEND_PG_TIMELINE_SHOW_HISTORY]: () => uxAction(),
  [PGEventsType.SEND_PG_TIMELINE_SHOW_MORE]: () => uxAction(),
  [PGEventsType.SEND_PG_TIMELINE_DOWNLOAD]: (payload) => uxAction(payload),
};
