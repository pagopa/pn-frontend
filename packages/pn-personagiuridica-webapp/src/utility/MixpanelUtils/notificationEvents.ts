import { uxAction, uxScreenView } from '@pagopa-pn/pn-commons';

import { PGEventsType } from '../../models/PGEventsType';
import {
  mapNotificationAttachmentToDocumentDownloadPayload,
  mapNotificationDetailToEventPayload,
  mapNotificationListToEventPayload,
  mapStartPaymentToEventPayload,
  mapTimelineLegalFactToDocumentDownloadPayload,
} from './mappers/notificationPayloadMappers';
import { TrackingConfigs } from './trackingTypes';

type NotificationEventType =
  | PGEventsType.SEND_PG_NOTIFICATION_DELEGATED
  | PGEventsType.SEND_PG_NOTIFICATION_DETAIL
  | PGEventsType.SEND_PG_NOTIFICATION_DOWNLOAD_ATTACHMENT
  | PGEventsType.SEND_PG_START_PAYMENT
  | PGEventsType.SEND_PG_TIMELINE_DOWNLOAD
  | PGEventsType.SEND_PG_TIMELINE_SHOW_MORE
  | PGEventsType.SEND_PG_YOUR_NOTIFICATION;

export const notificationTrackingConfigs: TrackingConfigs<NotificationEventType> = {
  [PGEventsType.SEND_PG_NOTIFICATION_DELEGATED]: (data) =>
    uxScreenView(mapNotificationListToEventPayload(data)),
  [PGEventsType.SEND_PG_NOTIFICATION_DETAIL]: (data) =>
    uxScreenView(mapNotificationDetailToEventPayload(data)),
  [PGEventsType.SEND_PG_NOTIFICATION_DOWNLOAD_ATTACHMENT]: (data) =>
    uxAction(mapNotificationAttachmentToDocumentDownloadPayload(data)),
  [PGEventsType.SEND_PG_START_PAYMENT]: () => uxAction(mapStartPaymentToEventPayload()),
  [PGEventsType.SEND_PG_TIMELINE_DOWNLOAD]: (data) =>
    uxAction(mapTimelineLegalFactToDocumentDownloadPayload(data)),
  [PGEventsType.SEND_PG_TIMELINE_SHOW_MORE]: () => uxAction(),
  [PGEventsType.SEND_PG_YOUR_NOTIFICATION]: (data) =>
    uxScreenView(mapNotificationListToEventPayload(data)),
};
