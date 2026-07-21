import { uxAction, uxScreenView } from '@pagopa-pn/pn-commons';

import { PAEventsType } from '../../models/PAEventsType';
import {
  mapNotificationAttachmentToDocumentDownloadPayload,
  mapNotificationListToEventPayload,
  mapTimelineLegalFactToDocumentDownloadPayload,
} from './mappers/notificationPayloadMappers';
import { TrackingConfigs } from './trackingTypes';

type NotificationEventType =
  | PAEventsType.SEND_PA_CANCEL_NOTIFICATION
  | PAEventsType.SEND_PA_NOTIFICATION_DETAIL
  | PAEventsType.SEND_PA_NOTIFICATION_DOWNLOAD_ATTACHMENT
  | PAEventsType.SEND_PA_NOTIFICATIONS
  | PAEventsType.SEND_PA_TIMELINE_DOWNLOAD
  | PAEventsType.SEND_PA_TIMELINE_SHOW_HISTORY
  | PAEventsType.SEND_PA_TIMELINE_SHOW_MORE;

export const notificationTrackingConfigs: TrackingConfigs<NotificationEventType> = {
  [PAEventsType.SEND_PA_CANCEL_NOTIFICATION]: () => uxAction(),
  [PAEventsType.SEND_PA_NOTIFICATION_DETAIL]: () => uxScreenView(),
  [PAEventsType.SEND_PA_NOTIFICATION_DOWNLOAD_ATTACHMENT]: (data) =>
    uxAction(mapNotificationAttachmentToDocumentDownloadPayload(data)),
  [PAEventsType.SEND_PA_NOTIFICATIONS]: (data) =>
    uxScreenView(mapNotificationListToEventPayload(data)),
  [PAEventsType.SEND_PA_TIMELINE_DOWNLOAD]: (data) =>
    uxAction(mapTimelineLegalFactToDocumentDownloadPayload(data)),
  [PAEventsType.SEND_PA_TIMELINE_SHOW_HISTORY]: () => uxAction(),
  [PAEventsType.SEND_PA_TIMELINE_SHOW_MORE]: () => uxAction(),
};
