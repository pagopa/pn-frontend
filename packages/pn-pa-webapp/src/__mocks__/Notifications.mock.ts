import { GetNotificationsResponse, NotificationStatus, formatDate } from '@pagopa-pn/pn-commons';

export const notificationsDTO: GetNotificationsResponse = {
  resultsPage: [
    {
      iun: 'mocked-iun-1',
      paProtocolNumber: 'mocked-paNotificationId-1',
      sender: 'mocked-senderId-1',
      sentAt: '2022-02-22T14:20:20.566Z',
      subject: 'mocked-subject-1',
      notificationStatus: NotificationStatus.DELIVERED,
      recipients: ['mocked-recipientId-1'],
    },
    {
      iun: 'mocked-iun-2',
      paProtocolNumber: 'mocked-paNotificationId-2',
      sender: 'mocked-senderId-2',
      sentAt: '2022-02-22T14:20:20.566Z',
      subject: 'mocked-subject-2',
      notificationStatus: NotificationStatus.DELIVERED,
      recipients: ['mocked-recipientId-2'],
    },
  ],
  moreResult: false,
  nextPagesKey: ['mocked-page-key-1'],
};

export const emptyNotificationsFromBe: GetNotificationsResponse = {
  resultsPage: [],
  moreResult: false,
  nextPagesKey: [],
};

export const notificationsToFe: GetNotificationsResponse = {
  ...notificationsDTO,
  resultsPage: notificationsDTO.resultsPage.map((r) => ({
    ...r,
    sentAt: formatDate(r.sentAt),
  })),
};
