import { formatDate, GetNotificationsResponse, NotificationStatus } from "@pagopa-pn/pn-commons";

export const notificationsFromBe: GetNotificationsResponse = {
  result: [
    {
      iun: 'mocked-iun',
      paNotificationId: 'mocked-paNotificationId',
      senderId: 'mocked-senderId',
      sentAt: '2022-02-22T14:20:20.566Z',
      subject: 'mocked-subject',
      notificationStatus: NotificationStatus.DELIVERED,
      recipientId: 'mocked-recipientId'
    }
  ],
  moreResult: false,
  nextPagesKey: []
}

export const notificationsToFe: GetNotificationsResponse = {
  ...notificationsFromBe,
  result: notificationsFromBe.result.map(r => ({
    ...r,
    sentAt: formatDate(r.sentAt)
  }))
}