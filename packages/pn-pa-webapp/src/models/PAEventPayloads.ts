import type {
  AppResponse,
  AppResponseError,
  EventPageType,
  LegalFactId,
  Notification,
  NotificationDetailOtherDocument,
} from '@pagopa-pn/pn-commons';

import { PAEventsType } from './PAEventsType';

export type YesNo = 'yes' | 'no';

/**
 * Application-level data passed by pages/components to the tracking layer.
 * These types should not mirror Mixpanel properties necessarily.
 * They, instead, follow the domain model.
 */
export type BooleanSuperPropertyEventData = {
  value: boolean;
};

export type PANotificationAttachmentEventData = {
  document: string | NotificationDetailOtherDocument | undefined;
};

export type PANotificationsListEventData = {
  notifications: Array<Notification>;
  pageNumber: number;
};

export type PATimelineLegalFactEventData = {
  legalFact: LegalFactId;
};

export type ToastErrorEventData = {
  error: AppResponseError;
  response: AppResponse;
  pageName?: EventPageType;
};

/**
 * Mixpanel payloads produced by mappers and then enriched by tracking helpers with
 * event_category/event_type
 */
export type PANotificationsListPayload = {
  page_number: number;
  total_count: number;
  delivered_count: number;
  opened_count: number;
  not_found_count: number;
  cancelled_count: number;
  effective_date_count: number;
  filed_count: number;
  sending_count: number;
};

export type PADocumentDownloadPayload = {
  document_type: string;
};

export type PAToastErrorPayload = {
  reason: string;
  traceid?: string;
  page_name?: EventPageType;
  action: string;
  httpStatusCode?: number;
  message?: string;
};

export type PAHasProperty = PAEventsType.SEND_PA_HAS_NOTIFICATIONS;

export type PAHasPayload<K extends PAHasProperty> = {
  [P in K]: YesNo;
};

export type PAEventPayloads = {
  /* API KEYS */
  [PAEventsType.SEND_PA_ADD_API_START]: undefined;
  [PAEventsType.SEND_PA_ADD_API_UX_SUCCESS]: undefined;
  [PAEventsType.SEND_PA_API_INTEGRATIONS]: undefined;

  /* ERROR */
  [PAEventsType.SEND_PA_TOAST_ERROR]: ToastErrorEventData;

  /* NEW NOTIFICATION */
  [PAEventsType.SEND_PA_DEBT_POSITION]: undefined;
  [PAEventsType.SEND_PA_DEBT_POSITION_DETAIL]: undefined;
  [PAEventsType.SEND_PA_DOCUMENTATION]: undefined;
  [PAEventsType.SEND_PA_NEW_NOTIFICATION]: undefined;
  [PAEventsType.SEND_PA_NEW_NOTIFICATION_UX_SUCCESS]: undefined;
  [PAEventsType.SEND_PA_PRELIMINARY_INFORMATION]: undefined;
  [PAEventsType.SEND_PA_RECIPIENTS]: undefined;

  /* NOTIFICATION */
  [PAEventsType.SEND_PA_CANCEL_NOTIFICATION]: undefined;
  [PAEventsType.SEND_PA_NOTIFICATION_DETAIL]: undefined;
  [PAEventsType.SEND_PA_NOTIFICATION_DOWNLOAD_ATTACHMENT]: PANotificationAttachmentEventData;
  [PAEventsType.SEND_PA_NOTIFICATIONS]: PANotificationsListEventData;
  [PAEventsType.SEND_PA_TIMELINE_DOWNLOAD]: PATimelineLegalFactEventData;
  [PAEventsType.SEND_PA_TIMELINE_SHOW_HISTORY]: undefined;
  [PAEventsType.SEND_PA_TIMELINE_SHOW_MORE]: undefined;

  /* SERVICE STATUS */
  [PAEventsType.SEND_PA_SERVICE_STATUS]: undefined;

  /* STATISTICS */
  [PAEventsType.SEND_PA_STATISTICS]: undefined;

  /* SUPER PROPERTIES */
  [PAEventsType.SEND_PA_HAS_NOTIFICATIONS]: BooleanSuperPropertyEventData;
};
