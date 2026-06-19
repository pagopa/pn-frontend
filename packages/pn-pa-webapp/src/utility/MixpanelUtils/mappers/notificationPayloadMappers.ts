import { isObject } from 'lodash-es';

import { NotificationDocumentType, NotificationStatus } from '@pagopa-pn/pn-commons';

import type {
  PADocumentDownloadPayload,
  PANotificationAttachmentEventData,
  PANotificationsListEventData,
  PANotificationsListPayload,
  PATimelineLegalFactEventData,
} from '../../../models/PAEventPayloads';

export const mapNotificationListToEventPayload = ({
  notifications,
  pageNumber,
}: PANotificationsListEventData): PANotificationsListPayload => ({
  page_number: pageNumber,
  total_count: notifications.length,
  delivered_count: notifications.filter(
    (notification) => notification.notificationStatus === NotificationStatus.DELIVERED
  ).length,
  opened_count: notifications.filter(
    (notification) => notification.notificationStatus === NotificationStatus.VIEWED
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
  filed_count: notifications.filter(
    (notification) => notification.notificationStatus === NotificationStatus.ACCEPTED
  ).length,
  sending_count: notifications.filter(
    (notification) => notification.notificationStatus === NotificationStatus.DELIVERING
  ).length,
  back_to_sender_count: notifications.filter(
    (notification) => notification.notificationStatus === NotificationStatus.RETURNED_TO_SENDER
  ).length,
});

export const mapNotificationAttachmentToDocumentDownloadPayload = ({
  document,
}: PANotificationAttachmentEventData): PADocumentDownloadPayload => ({
  document_type: isObject(document)
    ? NotificationDocumentType.AAR
    : NotificationDocumentType.ATTACHMENT,
});

export const mapTimelineLegalFactToDocumentDownloadPayload = ({
  legalFact,
}: PATimelineLegalFactEventData): PADocumentDownloadPayload => ({
  document_type: legalFact.category,
});
