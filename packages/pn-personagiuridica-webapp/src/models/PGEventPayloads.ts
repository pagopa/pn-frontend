import {
  Downtime,
  EventDowntimeType,
  INotificationDetailTimeline,
  Notification,
  NotificationStatus,
  PaymentsData,
} from '@pagopa-pn/pn-commons';

import { PGEventsType } from './PGEventsType';

export type YesNo = 'yes' | 'no';

/**
 * Application-level data passed by pages/components to the tracking layer.
 * These types should not mirror Mixpanel properties necessarily.
 * They, instead, follow the domain model.
 */

export type PGNotificationsListEventData = {
  notifications: Array<Notification>;
  pageNumber: number;
  domicileBannerType?: string;
};

export type PGNotificationDetailEventData = {
  downtimeEvents: Array<Downtime>;
  mandateId: string | undefined;
  notificationStatus: NotificationStatus;
  checkIfUserHasPayments: boolean;
  userPayments: PaymentsData;
  timeline: Array<INotificationDetailTimeline>;
};

/**
 * Mixpanel payloads produced by mappers and then enriched by tracking helpers with
 * event_category/event_type
 */
export type PGNotificationsListPayload = {
  page_number: number;
  unread_count: number;
  total_count: number;
  delivered_count: number;
  opened_count: number;
  expired_count: number;
  not_found_count: number;
  cancelled_count: number;
  effective_date_count: number;
  banner?: string;
};

export type PGNotificationDetailPayload = {
  notification_owner: boolean;
  notification_status: NotificationStatus;
  contains_payment: boolean;
  disservice_status: EventDowntimeType;
  contains_multipayment: YesNo;
  count_payment: number;
  contains_f24: YesNo;
  first_time_opening: boolean;
};

export type PGEventPayloads = {
  // NOTIFICATION
  [PGEventsType.SEND_PG_YOUR_NOTIFICATION]: PGNotificationsListEventData;
  [PGEventsType.SEND_PG_NOTIFICATION_DETAIL]: PGNotificationDetailEventData;

  // MANDATE
  [PGEventsType.SEND_PG_ADD_MANDATE_START]: undefined;
  [PGEventsType.SEND_PG_ADD_MANDATE_UX_SUCCESS]: undefined;
};
