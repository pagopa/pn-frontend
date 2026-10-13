import { BffFullSentInformalNotificationV1 } from '../generated-client/informal-notifications';
import { INFORMAL_NOTIFICATION_TIMELINE_MOCK } from './InformalNotificationTimeline.mock';

export const INFORMAL_NOTIFICATION_DETAIL_MOCK: BffFullSentInformalNotificationV1 = {
  iun: INFORMAL_NOTIFICATION_TIMELINE_MOCK.iun,
  senderDenomination: 'Comune di Palermo',
  recipients: INFORMAL_NOTIFICATION_TIMELINE_MOCK.recipients,
  subject: 'Test workflow',
  documents: [
    {
      digests: {
        sha256: 'SmHRur4+IVEaMHrYoof4mwzhxh3r2D/+WeVnMQnokgw=',
      },
      contentType: 'application/pdf',
      ref: {
        key: 'PN_COMMUNICATIONS_ATTACHMENT-6d29e600f5774ceca37671969bf98d87.pdf',
        versionToken: 'v1',
      },
      docIdx: '0',
    },
  ],
  notificationStatus: 'COMPLETED_REACHED',
  documentsAvailable: true,
  channelsStatus: [
    {
      channel: 'EMAIL',
      status: 'DELIVERED',
    },
    {
      channel: 'PEC',
      status: 'DELIVERED',
    },
    {
      channel: 'SMS',
      status: 'SENT',
    },
    {
      channel: 'SEND',
      status: 'FILED',
    },
  ],
  timeline: [
    {
      elementId: 'REQUEST_ACCEPTED.IUN_TMWQ-HVLU-DZQR-202610-U-A',
      timestamp: '2026-10-01T08:21:45.454306254Z',
      ingestionTimestamp: '2026-10-01T08:21:45.454306254Z',
      eventTimestamp: '2026-10-01T08:21:45.454306254Z',
      notificationSentAt: '2026-10-01T08:21:16.708870955Z',
      category: 'REQUEST_ACCEPTED',
      details: {
        recIndexes: [],
        notificationRequestId: 'VE1XUS1IVkxVLURaUVItMjAyNjEwLVUtQQ==',
        paProtocolNumber: '302060181188735798',
      },
    },
    {
      elementId:
        'GET_ADDRESS.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0.CHANNEL_EMAIL',
      timestamp: '2026-10-01T08:21:53.165010469Z',
      ingestionTimestamp: '2026-10-01T08:21:53.165010469Z',
      eventTimestamp: '2026-10-01T08:21:53.165010469Z',
      notificationSentAt: '2026-10-01T08:21:16.708870955Z',
      category: 'GET_ADDRESS',
      details: {
        recIndex: 0,
        digitalAddress: {
          type: 'EMAIL',
          address: 'utente@test.it',
        },
        digitalAddressSource: 'SPECIAL',
        channel: 'EMAIL',
        isAvailable: true,
        attemptDate: '2026-10-01T08:21:53.165004569Z',
      },
    },
    {
      elementId:
        'SEND_DIGITAL_MESSAGE.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.ATTEMPT_0.CHANNEL_EMAIL',
      timestamp: '2026-10-01T08:21:56.233299636Z',
      ingestionTimestamp: '2026-10-01T08:21:56.233299636Z',
      eventTimestamp: '2026-10-01T08:21:56.233299636Z',
      notificationSentAt: '2026-10-01T08:21:16.708870955Z',
      category: 'SEND_DIGITAL_MESSAGE',
      details: {
        recIndex: 0,
        digitalAddress: {
          type: 'EMAIL',
          address: 'utente@test.it',
        },
        digitalAddressSource: 'SPECIAL',
        channel: 'EMAIL',
      },
    },
    {
      elementId:
        'SEND_DIGITAL_MESSAGE_PROGRESS.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.IDX_1.CHANNEL_EMAIL',
      timestamp: '2026-10-01T08:26:12Z',
      ingestionTimestamp: '2026-10-01T08:26:14.29102669Z',
      eventTimestamp: '2026-10-01T08:26:12Z',
      notificationSentAt: '2026-10-01T08:21:16.708870955Z',
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
          code: 'M003',
          eventTimestamp: '2026-10-01T08:26:12Z',
        },
        eventTimestamp: '2026-10-01T08:26:12Z',
        requestId:
          'SEND_DIGITAL_MESSAGE.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.ATTEMPT_0.CHANNEL_EMAIL',
      },
    },
    {
      elementId:
        'SEND_DIGITAL_MESSAGE_PROGRESS.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.IDX_2.CHANNEL_EMAIL',
      timestamp: '2026-10-01T08:26:19Z',
      ingestionTimestamp: '2026-10-01T08:26:20.658762804Z',
      eventTimestamp: '2026-10-01T08:26:19Z',
      notificationSentAt: '2026-10-01T08:21:16.708870955Z',
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
    {
      elementId: 'DELIVERED.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.CHANNEL_EMAIL',
      timestamp: '2026-10-01T08:26:19Z',
      ingestionTimestamp: '2026-10-01T08:26:20.687953886Z',
      eventTimestamp: '2026-10-01T08:26:19Z',
      notificationSentAt: '2026-10-01T08:21:16.708870955Z',
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
        'GET_ADDRESS.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0.CHANNEL_PEC',
      timestamp: '2026-10-01T08:26:33.085969275Z',
      ingestionTimestamp: '2026-10-01T08:26:33.085969275Z',
      eventTimestamp: '2026-10-01T08:26:33.085969275Z',
      notificationSentAt: '2026-10-01T08:21:16.708870955Z',
      category: 'GET_ADDRESS',
      details: {
        recIndex: 0,
        digitalAddressSource: 'PLATFORM',
        channel: 'PEC',
        isAvailable: false,
        attemptDate: '2026-10-01T08:26:33.085963145Z',
      },
    },
    {
      elementId:
        'GET_ADDRESS.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0.CHANNEL_PEC',
      timestamp: '2026-10-01T08:26:33.139161551Z',
      ingestionTimestamp: '2026-10-01T08:26:33.139161551Z',
      eventTimestamp: '2026-10-01T08:26:33.139161551Z',
      notificationSentAt: '2026-10-01T08:21:16.708870955Z',
      category: 'GET_ADDRESS',
      details: {
        recIndex: 0,
        digitalAddress: {
          type: 'PEC',
          address: 'example@OK-pecSuccess.it',
        },
        digitalAddressSource: 'SPECIAL',
        channel: 'PEC',
        isAvailable: true,
        attemptDate: '2026-10-01T08:26:33.139155984Z',
      },
    },
    {
      elementId:
        'SEND_DIGITAL_MESSAGE.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.ATTEMPT_0.CHANNEL_PEC',
      timestamp: '2026-10-01T08:26:36.129154401Z',
      ingestionTimestamp: '2026-10-01T08:26:36.129154401Z',
      eventTimestamp: '2026-10-01T08:26:36.129154401Z',
      notificationSentAt: '2026-10-01T08:21:16.708870955Z',
      category: 'SEND_DIGITAL_MESSAGE',
      details: {
        recIndex: 0,
        digitalAddress: {
          type: 'PEC',
          address: 'example@OK-pecSuccess.it',
        },
        digitalAddressSource: 'SPECIAL',
        channel: 'PEC',
      },
    },
    {
      elementId:
        'SEND_DIGITAL_MESSAGE_PROGRESS.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.IDX_1.CHANNEL_PEC',
      timestamp: '2026-10-01T08:26:40.111250251Z',
      ingestionTimestamp: '2026-10-01T08:26:41.341419966Z',
      eventTimestamp: '2026-10-01T08:26:40.111250251Z',
      notificationSentAt: '2026-10-01T08:21:16.708870955Z',
      category: 'SEND_DIGITAL_MESSAGE_PROGRESS',
      details: {
        recIndex: 0,
        digitalAddress: {
          type: 'PEC',
          address: 'example@OK-pecSuccess.it',
        },
        digitalAddressSource: 'SPECIAL',
        channel: 'PEC',
        deliveryDetail: {
          code: 'C000',
          eventTimestamp: '2026-10-01T08:26:40.111250251Z',
        },
        eventTimestamp: '2026-10-01T08:26:40.111250251Z',
        requestId:
          'SEND_DIGITAL_MESSAGE.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.ATTEMPT_0.CHANNEL_PEC',
      },
    },
    {
      elementId:
        'SEND_DIGITAL_MESSAGE_PROGRESS.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.IDX_2.CHANNEL_PEC',
      timestamp: '2026-10-01T08:26:45.335633175Z',
      ingestionTimestamp: '2026-10-01T08:26:46.74546175Z',
      eventTimestamp: '2026-10-01T08:26:45.335633175Z',
      notificationSentAt: '2026-10-01T08:21:16.708870955Z',
      category: 'SEND_DIGITAL_MESSAGE_PROGRESS',
      details: {
        recIndex: 0,
        digitalAddress: {
          type: 'PEC',
          address: 'example@OK-pecSuccess.it',
        },
        digitalAddressSource: 'SPECIAL',
        channel: 'PEC',
        deliveryDetail: {
          code: 'C001',
          eventTimestamp: '2026-10-01T08:26:45.335633175Z',
        },
        eventTimestamp: '2026-10-01T08:26:45.335633175Z',
        requestId:
          'SEND_DIGITAL_MESSAGE.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.ATTEMPT_0.CHANNEL_PEC',
      },
    },
    {
      elementId:
        'SEND_DIGITAL_MESSAGE_FEEDBACK.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.CHANNEL_PEC',
      timestamp: '2026-10-01T08:26:50.754428516Z',
      ingestionTimestamp: '2026-10-01T08:26:52.1007726Z',
      eventTimestamp: '2026-10-01T08:26:50.754428516Z',
      notificationSentAt: '2026-10-01T08:21:16.708870955Z',
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
    {
      elementId: 'DELIVERED.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.CHANNEL_PEC',
      timestamp: '2026-10-01T08:26:50.754428516Z',
      ingestionTimestamp: '2026-10-01T08:26:52.133584935Z',
      eventTimestamp: '2026-10-01T08:26:50.754428516Z',
      notificationSentAt: '2026-10-01T08:21:16.708870955Z',
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
        'GET_ADDRESS.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0.CHANNEL_SMS',
      timestamp: '2026-10-01T08:33:33.376689627Z',
      ingestionTimestamp: '2026-10-01T08:33:33.376689627Z',
      eventTimestamp: '2026-10-01T08:33:33.376689627Z',
      notificationSentAt: '2026-10-01T08:21:16.708870955Z',
      category: 'GET_ADDRESS',
      details: {
        recIndex: 0,
        digitalAddress: {
          type: 'SMS',
          address: '+3900000',
        },
        digitalAddressSource: 'SPECIAL',
        channel: 'SMS',
        isAvailable: true,
        attemptDate: '2026-10-01T08:33:33.37668268Z',
      },
    },
    {
      elementId:
        'SEND_DIGITAL_MESSAGE.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.ATTEMPT_0.CHANNEL_SMS',
      timestamp: '2026-10-01T08:33:39.896891247Z',
      ingestionTimestamp: '2026-10-01T08:33:39.896891247Z',
      eventTimestamp: '2026-10-01T08:33:39.896891247Z',
      notificationSentAt: '2026-10-01T08:21:16.708870955Z',
      category: 'SEND_DIGITAL_MESSAGE',
      details: {
        recIndex: 0,
        digitalAddress: {
          type: 'SMS',
          address: '+3900000',
        },
        digitalAddressSource: 'SPECIAL',
        channel: 'SMS',
      },
    },
    {
      elementId:
        'SEND_DIGITAL_MESSAGE_FEEDBACK.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.CHANNEL_SMS',
      timestamp: '2026-10-01T08:33:45.013984415Z',
      ingestionTimestamp: '2026-10-01T08:33:46.222927381Z',
      eventTimestamp: '2026-10-01T08:33:45.013984415Z',
      notificationSentAt: '2026-10-01T08:21:16.708870955Z',
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
    {
      elementId: 'WORKFLOW_ENDED_REACHED.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0',
      timestamp: '2026-10-01T08:33:49.242468973Z',
      ingestionTimestamp: '2026-10-01T08:33:49.242468973Z',
      eventTimestamp: '2026-10-01T08:33:49.242468973Z',
      notificationSentAt: '2026-10-01T08:21:16.708870955Z',
      category: 'WORKFLOW_ENDED_REACHED',
      details: {
        recIndexes: [],
        recIndex: 0,
        sourceElementId:
          'SEND_DIGITAL_MESSAGE_PROGRESS.IUN_TMWQ-HVLU-DZQR-202610-U-A.RECINDEX_0.IDX_2.CHANNEL_EMAIL',
      },
    },
  ],
};
