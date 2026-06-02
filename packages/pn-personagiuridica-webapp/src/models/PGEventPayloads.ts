import type {
  AppResponse,
  AppResponseError,
  Downtime,
  LegalFactId,
  Notification,
  NotificationDetailOtherDocument,
  NotificationStatusHistory,
  PaymentsData,
} from '@pagopa-pn/pn-commons';
import {
  EventDowntimeType,
  EventNotificationSource,
  NotificationStatus,
} from '@pagopa-pn/pn-commons';
import {
  EventDeliveryFlowType,
  EventDeliveryModeType,
  EventPageType,
} from '@pagopa-pn/pn-commons/src/models/MixpanelEvents';

import { PGEventsType } from './PGEventsType';
import type { ChannelType, DigitalAddress } from './contacts';

export type YesNo = 'yes' | 'no';
export type PGUserRole = 'admin' | 'group_admin' | 'operator' | 'group_operator';

export type DigitalDomicileType = ChannelType.PEC | ChannelType.SERCQ_SEND | 'not_available';

export type MandatePersonType = 'PF' | 'PG';

export type MandatePartySelection = 'tuttiGliEnti' | 'entiSelezionati';

export type PGDocumentDownloadPayload = {
  document_type: string;
};

export type PGStartPaymentPayload = {
  psp: string;
};

export type PGToastErrorPayload = {
  reason: string;
  traceid?: string;
  page_name?: EventPageType;
  action: string;
  httpStatusCode?: number;
  message?: string;
};

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
  notificationStatusHistory: Array<NotificationStatusHistory>;
  source: EventNotificationSource;
  flow: EventDeliveryFlowType;
  deliveryMode: EventDeliveryModeType;
};

export type PGNotificationAttachmentEventData = {
  document: string | NotificationDetailOtherDocument | undefined;
};

export type PGTimelineLegalFactEventData = {
  legalFact: LegalFactId;
};

export type PGContactDetailsEventData = {
  addresses: Array<DigitalAddress>;
};

export type PGAddMandateSuccessEventData = {
  personType: MandatePersonType;
  partySelection: MandatePartySelection;
};

export type ToastErrorEventData = {
  error: AppResponseError;
  response: AppResponse;
  pageName?: EventPageType;
};

export type BooleanSuperPropertyEventData = {
  value: boolean;
};

export type DigitalDomicileSuperPropertyEventData =
  | {
      addresses: Array<DigitalAddress>;
      value?: never;
    }
  | {
      addresses?: never;
      value: DigitalDomicileType;
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
  source: EventNotificationSource;
  elapsed_time: number;
  flow: EventDeliveryFlowType;
  delivery_mode: EventDeliveryModeType;
};

export type PGContactDetailPayload = {
  digital_domicile_exists: boolean;
  digital_domicile_type: DigitalDomicileType;
  email_exists: boolean;
  telephone_exists: boolean;
};

export type DigitalDomicileTypePayload = {
  digital_domicile_type: DigitalDomicileType;
};

export type PGMandateSuccessPayload = {
  person_type: 'PF' | 'PG';
  mandate_type: 'all' | 'selected_party';
};

export type PGHasProperty =
  | PGEventsType.SEND_PG_HAS_EMAIL
  | PGEventsType.SEND_PG_HAS_SMS
  | PGEventsType.SEND_PG_HAS_MANDATE
  | PGEventsType.SEND_PG_HAS_MANDATE_GIVEN
  | PGEventsType.SEND_PG_HAS_NOTIFICATIONS;

export type PGDigitalDomicilePayload = {
  [PGEventsType.SEND_PG_HAS_DIGITAL_DOMICILE]: DigitalDomicileType;
};

export type PGHasPayload<K extends PGHasProperty> = {
  [P in K]: YesNo;
};

export type PGUserRolePayload = {
  [PGEventsType.USER_ROLE]: PGUserRole;
};

export type PGEventPayloads = {
  /* API KEYS */
  [PGEventsType.SEND_PG_API_INTEGRATION]: undefined;
  [PGEventsType.SEND_PG_ADD_API_START]: undefined;
  [PGEventsType.SEND_PG_ADD_API_UX_SUCCESS]: undefined;

  /* CONTACT */
  [PGEventsType.SEND_PG_YOUR_CONTACT_DETAILS]: PGContactDetailsEventData;
  // SERCQ
  [PGEventsType.SEND_PG_ADD_DD_SERCQ_SEND_START]: undefined;
  [PGEventsType.SEND_PG_ADD_DD_PEC_START]: undefined;
  [PGEventsType.SEND_PG_ADD_DIGITAL_DOMICILE_START]: undefined;
  [PGEventsType.SEND_PG_ADD_DIGITAL_DOMICILE_UX_SUCCESS]: DigitalDomicileTypePayload;
  [PGEventsType.SEND_PG_REMOVE_DIGITAL_DOMICILE_START]: undefined;
  [PGEventsType.SEND_PG_REMOVE_DIGITAL_DOMICILE_UX_SUCCESS]: undefined;
  // EMAIL
  [PGEventsType.SEND_PG_ADD_EMAIL_START]: undefined;
  [PGEventsType.SEND_PG_ADD_EMAIL_UX_SUCCESS]: undefined;
  [PGEventsType.SEND_PG_REMOVE_EMAIL_START]: undefined;
  [PGEventsType.SEND_PG_REMOVE_EMAIL_UX_SUCCESS]: undefined;
  // SMS
  [PGEventsType.SEND_PG_ADD_SMS_START]: undefined;
  [PGEventsType.SEND_PG_ADD_SMS_UX_SUCCESS]: undefined;
  [PGEventsType.SEND_PG_REMOVE_SMS_START]: undefined;
  [PGEventsType.SEND_PG_REMOVE_SMS_UX_SUCCESS]: undefined;

  /* ERROR */
  [PGEventsType.SEND_PG_TOAST_ERROR]: ToastErrorEventData;

  /* MANDATE */
  [PGEventsType.SEND_PG_ADD_MANDATE_START]: undefined;
  [PGEventsType.SEND_PG_ADD_MANDATE_UX_SUCCESS]: PGAddMandateSuccessEventData;
  [PGEventsType.SEND_PG_MANDATES_GIVEN]: undefined;
  [PGEventsType.SEND_PG_MANDATES_RECEIVED]: undefined;

  /* NAVIGATION */
  [PGEventsType.SEND_PG_EXIT]: undefined;
  [PGEventsType.SEND_PG_HELP]: undefined;
  [PGEventsType.SEND_PG_OPEN_GROUPS]: undefined;
  [PGEventsType.SEND_PG_OPEN_USERS]: undefined;

  /* NOTIFICATION */
  [PGEventsType.SEND_PG_NOTIFICATION_DELEGATED]: PGNotificationsListEventData;
  [PGEventsType.SEND_PG_NOTIFICATION_DETAIL]: PGNotificationDetailEventData;
  [PGEventsType.SEND_PG_NOTIFICATION_DOWNLOAD_ATTACHMENT]: PGNotificationAttachmentEventData;
  [PGEventsType.SEND_PG_START_PAYMENT]: undefined;
  [PGEventsType.SEND_PG_TIMELINE_DOWNLOAD]: PGTimelineLegalFactEventData;
  [PGEventsType.SEND_PG_TIMELINE_SHOW_HISTORY]: undefined;
  [PGEventsType.SEND_PG_TIMELINE_SHOW_MORE]: undefined;
  [PGEventsType.SEND_PG_YOUR_NOTIFICATION]: PGNotificationsListEventData;

  /* SERVICE STATUS */
  [PGEventsType.SEND_PG_SERVICE_STATUS]: undefined;

  /* SUPER PROPERTIES */
  [PGEventsType.SEND_PG_HAS_DIGITAL_DOMICILE]: DigitalDomicileSuperPropertyEventData;
  [PGEventsType.SEND_PG_HAS_EMAIL]: BooleanSuperPropertyEventData;
  [PGEventsType.SEND_PG_HAS_MANDATE]: BooleanSuperPropertyEventData;
  [PGEventsType.SEND_PG_HAS_MANDATE_GIVEN]: BooleanSuperPropertyEventData;
  [PGEventsType.SEND_PG_HAS_NOTIFICATIONS]: BooleanSuperPropertyEventData;
  [PGEventsType.SEND_PG_HAS_SMS]: BooleanSuperPropertyEventData;
  [PGEventsType.USER_ROLE]: PGUserRolePayload;
};
