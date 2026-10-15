import { BffFullSentInformalNotificationTimelineV1 } from '../generated-client/informal-notifications';

export const INFORMAL_NOTIFICATION_TIMELINE_MOCK: BffFullSentInformalNotificationTimelineV1 = {
  iun: 'TMWQ-HVLU-DZQR-202610-U-A',
  recipients: [
    {
      recipientType: 'PG',
      taxId: '11111111111',
      denomination: 'Utente Uno',
      digitalDomicile: {
        type: 'PEC',
        address: 'pec@test.it',
      },
      physicalAddress: {
        at: 'presso',
        address: 'Via Roma',
        addressDetails: '',
        zip: '20100',
        municipality: 'Roma',
        province: 'RM',
        foreignState: 'ITALIA',
      },
      payments: [
        {
          pagoPa: {
            noticeCode: '302100181188851800',
            creditorTaxId: '77777777777',
            attachment: {
              digests: {
                sha256: '1QKD/Ks6BohyQ+bgMxHf9NrpNhVmGUPxRYE1aerU4JQ=',
              },
              contentType: 'application/pdf',
              ref: {
                key: 'PN_COMMUNICATIONS_ATTACHMENT-dc5bf93a0c084a0aa83667c46f2a258a.pdf',
                versionToken: 'v1',
              },
            },
            amount: 100,
          },
        },
      ],
      messageId: 'b92e7470-0c8b-417f-bd3d-109ba4b10d96',
      email: 'utente@test.it',
      phoneNumber: '+3900000',
      additionalLanguages: [],
      message: {
        primaryMessage: {
          subject: 'È stata emessa una nuova fattura per te',
          longBody:
            "Test S.p.a. ti informa che è stata emessa una fattura per l'utenza n.1812121.\n",
          shortBody: 'SEND, ti informa che hai ricevuto\nuna comunicazione da Test S.p.A.\n',
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
      activeFrom: '2026-10-01T08:33:49.242468973Z',
      steps: [],
    },
    {
      status: 'PROCESSING',
      activeFrom: '2026-10-01T08:21:56.233299636Z',
      steps: [
        {
          channel: 'SMS',
          events: [
            {
              elementId:
                'SEND_DIGITAL_MESSAGE_FEEDBACK.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.CHANNEL_SMS',
              eventTimestamp: '2026-10-01T08:33:45.013984415Z',
              category: 'SEND_DIGITAL_MESSAGE_FEEDBACK',
              details: {
                recIndex: 0,
                digitalAddress: {
                  type: 'SMS',
                  address: '+3900000',
                },
                digitalAddressSource: 'SPECIAL',
                channel: 'SMS',
                deliveryDetail: {
                  code: 'S003',
                  eventTimestamp: '2026-10-01T08:33:45.013984415Z',
                },
                requestId:
                  'SEND_DIGITAL_MESSAGE.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.ATTEMPT_0.CHANNEL_SMS',
                responseStatus: 'OK',
                notificationDate: '2026-10-01T08:33:45.013984415Z',
              },
            },
          ],
        },
        {
          channel: 'PEC',
          events: [
            {
              elementId: 'DELIVERED.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.CHANNEL_PEC',
              eventTimestamp: '2026-10-01T08:26:50.754428516Z',
              category: 'DELIVERED',
              details: {
                recIndexes: [],
                recIndex: 0,
                channel: 'PEC',
                notificationDate: '2026-10-01T08:26:50.754428516Z',
                sourceElementId:
                  'SEND_DIGITAL_MESSAGE_FEEDBACK.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.CHANNEL_PEC',
              },
            },
            {
              elementId:
                'SEND_DIGITAL_MESSAGE_FEEDBACK.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.CHANNEL_PEC',
              eventTimestamp: '2026-10-01T08:26:50.754428516Z',
              category: 'SEND_DIGITAL_MESSAGE_FEEDBACK',
              details: {
                recIndex: 0,
                digitalAddress: {
                  type: 'PEC',
                  address: 'example@OK-pecSuccess.it',
                },
                digitalAddressSource: 'SPECIAL',
                channel: 'PEC',
                deliveryDetail: {
                  code: 'C003',
                  eventTimestamp: '2026-10-01T08:26:50.754428516Z',
                },
                requestId:
                  'SEND_DIGITAL_MESSAGE.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.ATTEMPT_0.CHANNEL_PEC',
                responseStatus: 'OK',
                notificationDate: '2026-10-01T08:26:50.754428516Z',
                sendingReceipts: [
                  {
                    id: 'mock-b37a897e-5e6c-4594-8473-1c0fedd99d5c',
                    system: 'mock-system',
                  },
                ],
              },
            },
          ],
        },
        {
          channel: 'EMAIL',
          events: [
            {
              elementId: 'DELIVERED.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.CHANNEL_EMAIL',
              eventTimestamp: '2026-10-01T08:26:19Z',
              category: 'DELIVERED',
              details: {
                recIndexes: [],
                recIndex: 0,
                channel: 'EMAIL',
                notificationDate: '2026-10-01T08:26:19Z',
                sourceElementId:
                  'SEND_DIGITAL_MESSAGE_PROGRESS.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.IDX_2.CHANNEL_EMAIL',
              },
            },
            {
              elementId:
                'SEND_DIGITAL_MESSAGE_PROGRESS.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.IDX_2.CHANNEL_EMAIL',
              eventTimestamp: '2026-10-01T08:26:19Z',
              category: 'SEND_DIGITAL_MESSAGE_PROGRESS',
              details: {
                recIndex: 0,
                digitalAddress: {
                  type: 'EMAIL',
                  address: 'utente@test.it',
                },
                digitalAddressSource: 'SPECIAL',
                channel: 'EMAIL',
                deliveryDetail: {
                  code: 'M004',
                  eventTimestamp: '2026-10-01T08:26:19Z',
                },
                eventTimestamp: '2026-10-01T08:26:19Z',
                requestId:
                  'SEND_DIGITAL_MESSAGE.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.ATTEMPT_0.CHANNEL_EMAIL',
              },
            },
          ],
        },
      ],
    },
    {
      status: 'ACCEPTED',
      activeFrom: '2026-10-01T08:21:16.708870955Z',
      steps: [],
    },
  ],
};
