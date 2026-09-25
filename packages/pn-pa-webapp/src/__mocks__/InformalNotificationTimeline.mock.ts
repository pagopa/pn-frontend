import { BffFullSentInformalNotificationTimelineV1 } from '../generated-client/informal-notifications';

export const INFORMAL_NOTIFICATION_TIMELINE_MOCK: BffFullSentInformalNotificationTimelineV1 = {
  iun: 'YWNY-YHRA-KTYL-202609-P-A',
  recipients: [
    {
      recipientType: 'PF',
      taxId: 'TSTUTN00A07A001G',
      denomination: 'Utente Test Uno',
      digitalDomicile: {
        type: 'PEC',
        address: 'pec@test.it',
      },
      physicalAddress: {
        at: 'Presso',
        address: 'Via Prova 1',
        addressDetails: 'Scala A',
        zip: '00118',
        municipality: 'Roma',
        municipalityDetails: 'Roma',
        province: 'RM',
        foreignState: 'ITALIA',
      },
      payments: [
        {
          pagoPa: {
            noticeCode: '321040300201910058',
            creditorTaxId: '77777777777',
            attachment: {
              digests: {
                sha256: 'BiKXEUdIbhkAA37/Ip2SHRT1tRqscXFymytm+BzfZYU=',
              },
              contentType: 'application/pdf',
              ref: {
                key: 'PN_COMMUNICATIONS_ATTACHMENT-26a88a30b70d4e84ac352c31e113c069.pdf',
                versionToken: 'sNP2YBogBBD2CXXe2dxx0DbOJO0AzyH.',
              },
            },
            amount: 150,
          },
        },
      ],
      messageId: 'af533722-a6e6-40b2-891a-1b27cd920d7b',
      additionalLanguages: [],
      message: {
        primaryMessage: {
          subject: 'Sollecito di pagamento',
          longBody:
            'Gentile cittadino, la informiamo che il pagamento risulta ancora non effettuato.',
          language: 'IT',
        },
      },
    },
  ],
  communicationOutcomes: {
    viewed: false,
    delivered: true,
  },
  notificationStatusHistory: [
    {
      status: 'COMPLETED_REACHED',
      activeFrom: '2026-09-21T14:00:15.837067215Z',
      steps: [],
    },
    {
      status: 'PROCESSING',
      activeFrom: '2026-09-21T13:59:54.645675731Z',
      steps: [
        {
          channel: 'PEC',
          events: [
            {
              elementId: 'DELIVERED.IUN_YWNY-YHRA-KTYL-202609-P-A.RECINDEX_0.CHANNEL_PEC',
              eventTimestamp: '2026-09-21T14:00:10.425392739Z',
              category: 'DELIVERED',
              details: {
                recIndexes: [],
                recIndex: 0,
                channel: 'PEC',
                notificationDate: '2026-09-21T14:00:10.425392739Z',
                sourceElementId:
                  'SEND_DIGITAL_MESSAGE_FEEDBACK.IUN_YWNY-YHRA-KTYL-202609-P-A.RECINDEX_0.CHANNEL_PEC',
              },
            },
            {
              elementId:
                'SEND_DIGITAL_MESSAGE_FEEDBACK.IUN_YWNY-YHRA-KTYL-202609-P-A.RECINDEX_0.CHANNEL_PEC',
              eventTimestamp: '2026-09-21T14:00:10.425392739Z',
              category: 'SEND_DIGITAL_MESSAGE_FEEDBACK',
              details: {
                recIndexes: [],
                recIndex: 0,
                digitalAddress: {
                  type: 'PEC',
                  address: 'pec@test.it',
                },
                channel: 'PEC',
                deliveryDetail: {
                  code: 'C003',
                  eventTimestamp: '2026-09-21T14:00:10.425392739Z',
                },
                requestId:
                  'SEND_DIGITAL_MESSAGE.IUN_YWNY-YHRA-KTYL-202609-P-A.RECINDEX_0.ATTEMPT_0.CHANNEL_PEC',
                responseStatus: 'OK',
                notificationDate: '2026-09-21T14:00:10.425392739Z',
                sendingReceipts: [
                  {
                    id: 'mock-0e2c6486-d314-47f5-a1e2-6fb5e1a707b4',
                    system: 'mock-system',
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      status: 'ACCEPTED',
      activeFrom: '2026-09-21T13:59:18.18103366Z',
      steps: [],
    },
  ],
};
