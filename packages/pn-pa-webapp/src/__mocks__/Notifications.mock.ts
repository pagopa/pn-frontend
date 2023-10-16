import { GetNotificationsResponse, NotificationStatus, formatDate } from '@pagopa-pn/pn-commons';

export const notificationsDTO: GetNotificationsResponse = {
  resultsPage: [
    {
      iun: 'XGPG-LXPA-YXRL-202308-M-1',
      paProtocolNumber: '302271690965154541',
      sender: 'Comune di palermo',
      sentAt: '2023-08-02T08:32:36.450806949Z',
      subject: 'notifica analogica con cucumber',
      notificationStatus: NotificationStatus.EFFECTIVE_DATE,
      recipients: ['CLMCST42R12D969Z', '20517490320'],
      group: '6467344676f10c7617353c90',
    },
    {
      iun: 'ZEXV-XVNG-HKNY-202308-D-1',
      paProtocolNumber: '302211690965154570',
      sender: 'Comune di palermo',
      sentAt: '2023-08-02T08:32:36.339328494Z',
      subject: 'notifica analogica con cucumber',
      notificationStatus: NotificationStatus.DELIVERED,
      recipients: ['CLMCST42R12D969Z', '20517490320'],
      group: '6467344676f10c7617353c90',
    },
    {
      iun: 'LQJA-EHAM-DGAU-202308-E-1',
      paProtocolNumber: '302201690965154413',
      sender: 'Comune di palermo',
      sentAt: '2023-08-02T08:32:36.305528014Z',
      subject: 'notifica analogica con cucumber',
      notificationStatus: NotificationStatus.EFFECTIVE_DATE,
      recipients: ['CLMCST42R12D969Z', '20517490320'],
      group: '6467344676f10c7617353c90',
    },
    {
      iun: 'PYRH-VGJR-GXTW-202308-V-1',
      paProtocolNumber: '302231690965154350',
      sender: 'Comune di palermo',
      sentAt: '2023-08-02T08:32:36.226986345Z',
      subject: 'notifica analogica con cucumber',
      notificationStatus: NotificationStatus.ACCEPTED,
      recipients: ['CLMCST42R12D969Z', '20517490320'],
      group: '6467344676f10c7617353c90',
    },
  ],
  moreResult: true,
  nextPagesKey: [
    'eyJlayI6IlBGLWE2YzEzNTBkLTFkNjktNDIwOS04YmY4LTMxZGU1OGM3OWQ2ZSMjMjAyMzA4IiwiaWsiOnsiaXVuX3JlY2lwaWVudElkIjoiUU1BTS1MWUhBLVBMVkUtMjAyMzA4LVgtMSMjUEYtYTZjMTM1MGQtMWQ2OS00MjA5LThiZjgtMzFkZTU4Yzc5ZDZlIiwicmVjaXBpZW50SWRfY3JlYXRpb25Nb250aCI6IlBGLWE2YzEzNTBkLTFkNjktNDIwOS04YmY4LTMxZGU1OGM3OWQ2ZSMjMjAyMzA4Iiwic2VudEF0IjoiMjAyMy0wOC0wMlQwODozMjozNS45MTg5NTYyMDdaIn19',
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
