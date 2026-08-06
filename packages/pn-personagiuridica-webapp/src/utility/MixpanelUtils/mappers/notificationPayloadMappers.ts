import type { Downtime } from '@pagopa-pn/pn-commons';
import {
  EventDowntimeType,
  InformalNotificationStatus,
  NotificationStatus,
  getElapsedTime,
} from '@pagopa-pn/pn-commons';

import {
  EventDefaultValue,
  MIXPANEL_NOTIFICATION_TYPE_MAP,
  type PGDocumentDownloadPayload,
  type PGNotificationAttachmentEventData,
  type PGNotificationAttachmentPayload,
  type PGNotificationDetailEventData,
  type PGNotificationDetailPayload,
  type PGNotificationsListEventData,
  type PGNotificationsListPayload,
  type PGStartPaymentEventData,
  type PGStartPaymentPayload,
  type PGTimelineLegalFactEventData,
} from '../../../models/PGEventPayloads';

const getDisserviceStatus = (downtimeEvents: Array<Downtime>): EventDowntimeType => {
  if (downtimeEvents.length === 0) {
    return EventDowntimeType.NOT_DISSERVICE;
  }

  return downtimeEvents.every((downtime) => !!downtime.endDate)
    ? EventDowntimeType.COMPLETED
    : EventDowntimeType.IN_PROGRESS;
};

export const mapNotificationDetailToEventPayload = (
  data: PGNotificationDetailEventData
): PGNotificationDetailPayload => {
  if (data.notificationType === 'INFORMAL') {
    return {
      notification_type: MIXPANEL_NOTIFICATION_TYPE_MAP[data.notificationType],
      notification_owner: true,
      notification_status: data.notificationStatus,
      contains_payment: data.paymentCount > 0,
      disservice_status: EventDefaultValue.NOT_SET,
      contains_multipayment: data.paymentCount > 1 ? 'yes' : 'no',
      count_payment: data.paymentCount,
      contains_f24: 'no',
      source: 'LISTA_NOTIFICHE',
      flow: EventDefaultValue.NOT_SET,
      delivery_mode: EventDefaultValue.NOT_SET,
    };
  }

  const {
    downtimeEvents,
    mandateId,
    notificationStatus,
    checkIfUserHasPayments,
    userPayments,
    notificationStatusHistory,
    source,
    flow,
    deliveryMode,
  } = data;

  const hasF24 =
    userPayments.f24Only.length > 0 || userPayments.pagoPaF24.some((payment) => payment.f24);

  const viewedEvent = notificationStatusHistory.find(
    (item) => item.status === NotificationStatus.VIEWED
  );

  const deliveredEvent = notificationStatusHistory.find(
    (item) => item.status === NotificationStatus.DELIVERED
  );

  return {
    notification_type: MIXPANEL_NOTIFICATION_TYPE_MAP[data.notificationType],
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

export const mapNotificationListToEventPayload = ({
  notifications,
  pageNumber,
  domicileBannerType,
}: PGNotificationsListEventData): PGNotificationsListPayload => {
  const legalNotifications = notifications.filter(
    (notification) => notification.communicationType === 'LEGAL'
  );

  const informalNotifications = notifications.filter(
    (notification) => notification.communicationType === 'INFORMAL'
  );

  return {
    page_number: pageNumber,
    total_count: legalNotifications.length,
    unread_count: legalNotifications.filter((notification) => notification.isNewNotification)
      .length,
    delivered_count: legalNotifications.filter(
      (notification) => notification.notificationStatus === NotificationStatus.DELIVERED
    ).length,
    opened_count: legalNotifications.filter(
      (notification) => notification.notificationStatus === NotificationStatus.VIEWED
    ).length,
    expired_count: legalNotifications.filter(
      (notification) => notification.notificationStatus === NotificationStatus.EFFECTIVE_DATE
    ).length,
    not_found_count: legalNotifications.filter(
      (notification) => notification.notificationStatus === NotificationStatus.UNREACHABLE
    ).length,
    cancelled_count: legalNotifications.filter(
      (notification) => notification.notificationStatus === NotificationStatus.CANCELLED
    ).length,
    effective_date_count: legalNotifications.filter(
      (notification) => notification.notificationStatus === NotificationStatus.EFFECTIVE_DATE
    ).length,
    filed_count: legalNotifications.filter(
      (notification) => notification.notificationStatus === NotificationStatus.ACCEPTED
    ).length,
    sending_count: legalNotifications.filter(
      (notification) => notification.notificationStatus === NotificationStatus.DELIVERING
    ).length,
    back_to_sender_count: legalNotifications.filter(
      (notification) => notification.notificationStatus === NotificationStatus.RETURNED_TO_SENDER
    ).length,

    total_combo_count: informalNotifications.length,
    unread_combo_count: informalNotifications.filter(
      (notification) => notification.isNewNotification
    ).length,
    delivered_combo_count: informalNotifications.filter(
      (notification) => notification.communicationOutcomes?.delivered
    ).length,
    opened_combo_count: informalNotifications.filter(
      (notification) => notification.communicationOutcomes?.viewed
    ).length,
    not_found_combo_count: informalNotifications.filter(
      (notification) =>
        notification.notificationStatus === InformalNotificationStatus.COMPLETED_UNREACHED
    ).length,

    ...(domicileBannerType && { banner: domicileBannerType }),
  };
};

export const mapNotificationAttachmentToDocumentDownloadPayload = ({
  notificationType,
  documentType,
}: PGNotificationAttachmentEventData): PGNotificationAttachmentPayload => ({
  document_type: documentType,
  notification_type: MIXPANEL_NOTIFICATION_TYPE_MAP[notificationType],
});

export const mapTimelineLegalFactToDocumentDownloadPayload = ({
  legalFact,
}: PGTimelineLegalFactEventData): PGDocumentDownloadPayload => ({
  document_type: legalFact.category,
});

export const mapStartPaymentToEventPayload = ({
  notificationType,
}: PGStartPaymentEventData): PGStartPaymentPayload => ({
  notification_type: MIXPANEL_NOTIFICATION_TYPE_MAP[notificationType],
  psp: 'pagopa',
});
