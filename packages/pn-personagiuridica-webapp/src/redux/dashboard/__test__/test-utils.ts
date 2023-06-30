import { formatDate, GetNotificationsResponse, NotificationStatus } from "@pagopa-pn/pn-commons";

export const notificationsFromBe: GetNotificationsResponse = {
  resultsPage: [
    {
      iun: 'mocked-iun',
      paProtocolNumber: 'mocked-paNotificationId',
      sender: 'mocked-senderId',
      sentAt: '2022-02-22T14:20:20.566Z',
      subject: 'mocked-subject',
      notificationStatus: NotificationStatus.DELIVERED,
      recipients: ['mocked-recipientId']
    }
  ],
  moreResult: false,
  nextPagesKey: []
}

export const notificationsToFe: GetNotificationsResponse = {
  ...notificationsFromBe,
  resultsPage: notificationsFromBe.resultsPage.map(r => ({
    ...r,
    sentAt: formatDate(r.sentAt)
  }))
}