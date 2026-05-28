import { isObject } from 'lodash-es';

import type {
  Downtime,
  EventNotificationSource,
  LegalFactId,
  Notification,
  NotificationDetailOtherDocument,
  NotificationStatusHistory,
  PaymentsData,
} from '@pagopa-pn/pn-commons';
import {
  EventDowntimeType,
  NotificationDocumentType,
  NotificationStatus,
  getElapsedTime,
  isNewNotification,
} from '@pagopa-pn/pn-commons';
import {
  EventDeliveryFlowType,
  EventDeliveryModeType,
} from '@pagopa-pn/pn-commons/src/models/MixpanelEvents';

import type { PGEventPayloads } from '../../../models/PGEventPayloads';
import type { PGEventsType } from '../../../models/PGEventsType';

const getDisserviceStatus = (downtimeEvents: Array<Downtime>): EventDowntimeType => {
  if (downtimeEvents.length === 0) {
    return EventDowntimeType.NOT_DISSERVICE;
  }

  return downtimeEvents.every((downtime) => !!downtime.endDate)
    ? EventDowntimeType.COMPLETED
    : EventDowntimeType.IN_PROGRESS;
};

export const mapNotificationDetailToEventPayload = ({
  downtimeEvents,
  mandateId,
  notificationStatus,
  checkIfUserHasPayments,
  userPayments,
  notificationStatusHistory,
  source,
  flow,
  deliveryMode,
}: {
  downtimeEvents: Array<Downtime>;
  mandateId: string | undefined;
  notificationStatus: NotificationStatus;
  checkIfUserHasPayments: boolean;
  userPayments: PaymentsData;
  notificationStatusHistory: Array<NotificationStatusHistory>;
  source: EventNotificationSource;
  flow: EventDeliveryFlowType;
  deliveryMode: EventDeliveryModeType;
}): PGEventPayloads[PGEventsType.SEND_PG_NOTIFICATION_DETAIL] => {
  const hasF24 =
    userPayments.f24Only.length > 0 || userPayments.pagoPaF24.some((payment) => payment.f24);

  const viewedEvent = notificationStatusHistory.find(
    (item) => item.status === NotificationStatus.VIEWED
  );

  const deliveredEvent = notificationStatusHistory.find(
    (item) => item.status === NotificationStatus.DELIVERED
  );

  return {
    notification_owner: !mandateId,
    notification_status: notificationStatus,
    contains_payment: checkIfUserHasPayments,
    disservice_status: getDisserviceStatus(downtimeEvents),
    contains_multipayment:
      userPayments.f24Only.length + userPayments.pagoPaF24.length > 1 ? 'yes' : 'no',
    count_payment: userPayments.pagoPaF24.filter((payment) => payment.pagoPa).length,
    contains_f24: hasF24 ? 'yes' : 'no',
    first_time_opening: !viewedEvent,
    source,
    elapsed_time: getElapsedTime(deliveredEvent?.activeFrom, viewedEvent?.activeFrom),
    flow,
    delivery_mode: deliveryMode,
  };
};

export const mapNotificationListToEventPayload = (
  notifications: Array<Notification>,
  pageNumber: number,
  domicileBannerType?: string
): PGEventPayloads[PGEventsType.SEND_PG_YOUR_NOTIFICATION] => ({
  page_number: pageNumber,
  total_count: notifications.length,
  unread_count: notifications.filter((notification) =>
    isNewNotification(notification.notificationStatus)
  ).length,
  delivered_count: notifications.filter(
    (notification) => notification.notificationStatus === NotificationStatus.DELIVERED
  ).length,
  opened_count: notifications.filter(
    (notification) => notification.notificationStatus === NotificationStatus.VIEWED
  ).length,
  expired_count: notifications.filter(
    (notification) => notification.notificationStatus === NotificationStatus.EFFECTIVE_DATE
  ).length,
  not_found_count: notifications.filter(
    (notification) => notification.notificationStatus === NotificationStatus.UNREACHABLE
  ).length,
  cancelled_count: notifications.filter(
    (notification) => notification.notificationStatus === NotificationStatus.CANCELLED
  ).length,
  effective_date_count: notifications.filter(
    (notification) => notification.notificationStatus === NotificationStatus.EFFECTIVE_DATE
  ).length,
  ...(domicileBannerType && { banner: domicileBannerType }),
});

export const mapNotificationAttachmentToDocumentDownloadPayload = (
  document: string | NotificationDetailOtherDocument | undefined
): PGEventPayloads[PGEventsType.SEND_PG_NOTIFICATION_DOWNLOAD_ATTACHMENT] => ({
  document_type: isObject(document)
    ? NotificationDocumentType.AAR
    : NotificationDocumentType.ATTACHMENT,
});

export const mapTimelineLegalFactToDocumentDownloadPayload = (
  legalFact: LegalFactId
): PGEventPayloads[PGEventsType.SEND_PG_TIMELINE_DOWNLOAD] => ({
  document_type: legalFact.category,
});

export const mapStartPaymentToEventPayload =
  (): PGEventPayloads[PGEventsType.SEND_PG_START_PAYMENT] => ({
    psp: 'pagopa',
  });
