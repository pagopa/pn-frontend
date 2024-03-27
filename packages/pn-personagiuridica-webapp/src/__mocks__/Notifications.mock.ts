import { GetNotificationsResponse, NotificationStatus, formatDate } from '@pagopa-pn/pn-commons';

export const notificationsDTO: GetNotificationsResponse = {
  resultsPage: [
    {
      iun: 'DAPQ-LWQV-DKQH-202308-A-1',
      paProtocolNumber: 'TA-FFSMRC-20230823-2',
      sender: 'Comune di Palermo',
      sentAt: '2023-08-23T07:38:49.601270863Z',
      subject: 'Pagamento rata IMU',
      notificationStatus: NotificationStatus.VIEWED,
      recipients: ['CLMCST42R12D969Z', 'DRCGNN12A46A326K', 'LVLDAA85T50G702B'],
      group: 'group-1',
    },
    {
      iun: 'HRTX-GZQZ-DZDX-202308-G-1',
      paProtocolNumber: '302011692692662485',
      sender: 'Comune di palermo',
      sentAt: '2023-08-22T08:24:24.712092954Z',
      subject: 'notifica analogica con cucumber',
      notificationStatus: NotificationStatus.EFFECTIVE_DATE,
      recipients: ['LVLDAA85T50G702B'],
      group: 'group-3',
    },
    {
      iun: 'DKRU-XUDK-UERQ-202308-X-1',
      paProtocolNumber: '302011692692650555',
      sender: 'Comune di palermo',
      sentAt: '2023-08-22T08:24:14.052873724Z',
      subject: 'notifica analogica con cucumber',
      notificationStatus: NotificationStatus.VIEWED,
      recipients: ['LVLDAA85T50G702B'],
      group: 'group-1',
    },
  ],
  moreResult: false,
  nextPagesKey: [
    'eyJlayI6IlBGLWIzMmU0OTIwLTZmZjMtNDg3Mi04MDE4LWQ2MGE0ZTU4MjdmOSMjMjAyMzA4IiwiaWsiOnsiaXVuX3JlY2lwaWVudElkIjoiREdWRy1aTVVMLVRaUFQtMjAyMzA4LVItMSMjUEYtYjMyZTQ5MjAtNmZmMy00ODcyLTgwMTgtZDYwYTRlNTgyN2Y5IiwicmVjaXBpZW50SWRfY3JlYXRpb25Nb250aCI6IlBGLWIzMmU0OTIwLTZmZjMtNDg3Mi04MDE4LWQ2MGE0ZTU4MjdmOSMjMjAyMzA4Iiwic2VudEF0IjoiMjAyMy0wOC0yMVQwODoyMjo0NC4zNzYzOTI1NTlaIn19',
  ],
};

export const emptyNotificationsFromBe: GetNotificationsResponse = {
  resultsPage: [],
  moreResult: false,
  nextPagesKey: [],
};

export const notificationsToFe: GetNotificationsResponse = {
  ...notificationsDTO,
};
