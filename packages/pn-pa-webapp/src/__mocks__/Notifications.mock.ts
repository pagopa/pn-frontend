import { GetNotificationsResponse, NotificationStatus, formatDate } from '@pagopa-pn/pn-commons';

export const notificationsDTO: GetNotificationsResponse = {
  resultsPage: [
    {
      iun: 'NRJP-NZRW-LDTL-202308-L-1',
      paProtocolNumber: 'protocol2107202216185501410',
      sender: 'Comune di Palermo',
      sentAt: '2023-08-22T08:47:39.655127013Z',
      subject: 'multa55555',
      notificationStatus: NotificationStatus.EFFECTIVE_DATE,
      recipients: ['GRBGPP87L04L741X'],
      group: '000',
    },
    {
      iun: 'HYTD-ERPH-WDUE-202308-H-1',
      paProtocolNumber: 'protocol210720221618555451',
      sender: 'Comune di Palermo',
      sentAt: '2023-08-18T08:38:21.218280819Z',
      subject: 'multa15100',
      notificationStatus: NotificationStatus.ACCEPTED,
      recipients: ['GRBGPP87L04L741X'],
      group: '000',
    },
  ],
  moreResult: false,
  nextPagesKey: [
    'eyJlayI6IjViOTk0ZDRhLTBmYTgtNDdhYy05YzdiLTM1NGYxZDQ0YTFjZSMjMjAyMzA4IiwiaWsiOnsiaXVuX3JlY2lwaWVudElkIjoiVVJLWS1YRFlHLVdVTkotMjAyMzA4LUEtMSMjUEYtMDc5ODlkZTItZjA3MS00ZGNkLWJlZWUtODUzYzQzNDQxMTdmIiwic2VudEF0IjoiMjAyMy0wOC0xNFQxMzo0MTozMS4xMTIxOTI3NTZaIiwic2VuZGVySWRfY3JlYXRpb25Nb250aCI6IjViOTk0ZDRhLTBmYTgtNDdhYy05YzdiLTM1NGYxZDQ0YTFjZSMjMjAyMzA4In19',
  ],
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
