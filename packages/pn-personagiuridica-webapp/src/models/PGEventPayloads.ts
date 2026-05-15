import { EventDowntimeType, NotificationStatus } from '@pagopa-pn/pn-commons';

import { PGEventsType } from './PGEventsType';

export type YesNo = 'yes' | 'no';

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
  [PGEventsType.SEND_PG_YOUR_NOTIFICATION]: PGNotificationsListPayload;
  [PGEventsType.SEND_PG_NOTIFICATION_DETAIL]: PGNotificationDetailPayload;

  // MANDATE
  [PGEventsType.SEND_PG_ADD_MANDATE_START]: undefined;
  [PGEventsType.SEND_PG_ADD_MANDATE_UX_SUCCESS]: undefined;
};
