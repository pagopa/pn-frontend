import { EventDowntimeType, NotificationStatus } from '@pagopa-pn/pn-commons';

import { PGEventsType } from './PGEventsType';
import { ChannelType } from './contacts';

export type YesNo = 'yes' | 'no';

export type DigitalDomicileType = ChannelType.PEC | ChannelType.SERCQ_SEND | 'not_available';

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

export type PGContactDetailPayload = {
  digital_domicile_exists: boolean;
  digital_domicile_type: DigitalDomicileType;
  email_exists: boolean;
  telephone_exists: boolean;
};

export type PGEventPayloads = {
  // CONTACT
  [PGEventsType.SEND_PG_YOUR_CONTACT_DETAILS]: PGContactDetailPayload;

  // MANDATE
  [PGEventsType.SEND_PG_ADD_MANDATE_START]: undefined;
  [PGEventsType.SEND_PG_ADD_MANDATE_UX_SUCCESS]: undefined;
  [PGEventsType.SEND_PG_MANDATES_GIVEN]: undefined;
  [PGEventsType.SEND_PG_MANDATES_RECEIVED]: undefined;

  // NAVIGATION
  [PGEventsType.SEND_PG_EXIT]: undefined;
  [PGEventsType.SEND_PG_HELP]: undefined;
  [PGEventsType.SEND_PG_OPEN_GROUPS]: undefined;
  [PGEventsType.SEND_PG_OPEN_USERS]: undefined;

  // NOTIFICATION
  [PGEventsType.SEND_PG_NOTIFICATION_DELEGATED]: PGNotificationsListPayload;
  [PGEventsType.SEND_PG_NOTIFICATION_DETAIL]: PGNotificationDetailPayload;
  [PGEventsType.SEND_PG_YOUR_NOTIFICATION]: PGNotificationsListPayload;
};
