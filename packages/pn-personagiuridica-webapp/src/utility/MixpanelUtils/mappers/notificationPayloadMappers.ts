import type {
  Downtime,
  INotificationDetailTimeline,
  Notification,
  PaymentsData,
} from '@pagopa-pn/pn-commons';
import {
  EventDowntimeType,
  NotificationStatus,
  TimelineCategory,
  isNewNotification,
} from '@pagopa-pn/pn-commons';

import type {
  PGNotificationDetailPayload,
  PGNotificationsListPayload,
} from '../../../models/PGEventPayloads';

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
  timeline,
}: {
  downtimeEvents: Array<Downtime>;
  mandateId: string | undefined;
  notificationStatus: NotificationStatus;
  checkIfUserHasPayments: boolean;
  userPayments: PaymentsData;
  timeline: Array<INotificationDetailTimeline>;
}): PGNotificationDetailPayload => {
  const hasF24 =
    userPayments.f24Only.length > 0 || userPayments.pagoPaF24.some((payment) => payment.f24);

  return {
    notification_owner: !mandateId,
    notification_status: notificationStatus,
    contains_payment: checkIfUserHasPayments,
    disservice_status: getDisserviceStatus(downtimeEvents),
    contains_multipayment:
      userPayments.f24Only.length + userPayments.pagoPaF24.length > 1 ? 'yes' : 'no',
    count_payment: userPayments.pagoPaF24.filter((payment) => payment.pagoPa).length,
    contains_f24: hasF24 ? 'yes' : 'no',
    first_time_opening: !timeline.some(
      (item) => item.category === TimelineCategory.NOTIFICATION_VIEWED
    ),
  };
};

export const mapNotificationListToEventPayload = (
  notifications: Array<Notification>,
  pageNumber: number,
  domicileBannerType?: string
): PGNotificationsListPayload => ({
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
