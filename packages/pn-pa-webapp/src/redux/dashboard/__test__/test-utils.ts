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

export const notificationsFromBePage2: GetNotificationsResponse = {
  resultsPage: [
    {
      iun: 'mocked-iun-2',
      paProtocolNumber: 'mocked-paNotificationId-2',
      sender: 'mocked-senderId-2',
      sentAt: '2022-02-22T14:20:20.566Z',
      subject: 'mocked-subject-2',
      notificationStatus: NotificationStatus.DELIVERED,
      recipients: ['mocked-recipientId-2']
    }
  ],
  moreResult: false,
  nextPagesKey: []
}

export const notificationsFromBe2rows: GetNotificationsResponse = {
  resultsPage: [
    {
      iun: 'mocked-iun-1',
      paProtocolNumber: 'mocked-paNotificationId-1',
      sender: 'mocked-senderId-1',
      sentAt: '2022-02-22T14:20:20.566Z',
      subject: 'mocked-subject-1',
      notificationStatus: NotificationStatus.DELIVERED,
      recipients: ['mocked-recipientId-1']
    },
    {
      iun: 'mocked-iun-2',
      paProtocolNumber: 'mocked-paNotificationId-2',
      sender: 'mocked-senderId-2',
      sentAt: '2022-02-22T14:20:20.566Z',
      subject: 'mocked-subject-2',
      notificationStatus: NotificationStatus.DELIVERED,
      recipients: ['mocked-recipientId-2']
    }
  ],
  moreResult: false,
  nextPagesKey: []
}

export const emptyNotificationsFromBe: GetNotificationsResponse = {
  resultsPage: [],
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