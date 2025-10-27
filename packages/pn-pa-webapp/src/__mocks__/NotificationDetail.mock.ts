import * as _ from 'lodash-es';

import {
  DigitalDomicileType,
  INotificationDetailTimeline,
  LegalFactType,
  NotificationDeliveryMode,
  NotificationDetail,
  NotificationDetailPayment,
  NotificationDetailRecipient,
  NotificationStatus,
  NotificationStatusHistory,
  RecipientType,
  ResponseStatus,
  TimelineCategory,
} from '@pagopa-pn/pn-commons';

function getOneRecipientNotification(): NotificationDetail {
  const oneRecipientNotification = _.cloneDeep(notificationDTOMultiRecipient);
  oneRecipientNotification.recipients = [oneRecipientNotification.recipients[0]];
  oneRecipientNotification.timeline = oneRecipientNotification.timeline.filter(
    (t) => 'recIndex' in t.details && !t.details.recIndex
  );
  oneRecipientNotification.notificationStatusHistory =
    oneRecipientNotification.notificationStatusHistory.map((status) => ({
      ...status,
      steps: status.steps?.filter((step) => 'recIndex' in step.details && !step.details.recIndex),
      relatedTimelineElements: status.relatedTimelineElements.filter(
        (elem) => elem.indexOf('RECINDEX_0') > -1
      ),
    }));
  return oneRecipientNotification;
}

const timeline: Array<INotificationDetailTimeline> = [
  {
    elementId: 'REQUEST_ACCEPTED.IUN_RTRD-UDGU-QTQY-202308-P-1',
    timestamp: '2023-08-25T09:34:58.041398918Z',
    legalFactsIds: [],
    category: TimelineCategory.REQUEST_ACCEPTED,
    details: {},
    index: 0,
    hidden: true,
  },
  {
    elementId: 'AAR_GEN.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
    timestamp: '2023-08-25T09:35:27.328299384Z',
    category: TimelineCategory.AAR_GENERATION,
    details: {
      recIndex: 1,
    },
    legalFactsIds: [],
    index: 1,
    hidden: true,
  },
  {
    elementId: 'AAR_GEN.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
    timestamp: '2023-08-25T09:35:27.34501351Z',
    category: TimelineCategory.AAR_GENERATION,
    details: {
      recIndex: 0,
    },
    legalFactsIds: [],
    index: 2,
    hidden: true,
  },
  {
    elementId:
      'SEND_COURTESY_MESSAGE.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.COURTESYADDRESSTYPE_SMS',
    timestamp: '2023-08-25T09:35:28.673819084Z',
    category: TimelineCategory.SEND_COURTESY_MESSAGE,
    details: {
      recIndex: 0,
      digitalAddress: {
        type: DigitalDomicileType.SMS,
        address: '+393889533897',
      },
    },
    legalFactsIds: [],
    index: 3,
    hidden: false,
  },
  {
    elementId: 'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
    timestamp: '2023-08-25T09:35:37.430018585Z',
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 0,
    },
    legalFactsIds: [],
    index: 4,
    hidden: true,
  },
  {
    elementId: 'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_PLATFORM.ATTEMPT_0',
    timestamp: '2023-08-25T09:35:37.438177621Z',
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 1,
    },
    legalFactsIds: [],
    index: 5,
    hidden: true,
  },
  {
    elementId: 'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
    timestamp: '2023-08-25T09:35:37.459264115Z',
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 0,
    },
    legalFactsIds: [],
    index: 6,
    hidden: true,
  },
  {
    elementId: 'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
    timestamp: '2023-08-25T09:35:37.467148235Z',
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 1,
    },
    legalFactsIds: [],
    index: 7,
    hidden: true,
  },
  {
    elementId:
      'SEND_DIGITAL.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
    timestamp: '2023-08-25T09:35:37.972607129Z',
    category: TimelineCategory.SEND_DIGITAL_DOMICILE,
    details: {
      recIndex: 0,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'notifichedigitali-uat@pec.pagopa.it',
      },
    },
    index: 8,
    hidden: false,
  },
  {
    elementId:
      'SEND_DIGITAL.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
    timestamp: '2023-08-25T09:35:40.989759156Z',
    category: TimelineCategory.SEND_DIGITAL_DOMICILE,
    details: {
      recIndex: 1,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'testpagopa3@pec.pagopa.it',
      },
    },
    index: 9,
    hidden: false,
  },
  {
    elementId:
      'DIGITAL_PROG.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0.IDX_1',
    timestamp: '2023-08-25T09:35:48.01877805Z',
    legalFactsIds: [
      {
        key: 'PN_EXTERNAL_LEGAL_FACTS-bf46b5cb7617404095595a4ed53a4022.xml',
        category: LegalFactType.PEC_RECEIPT,
      },
    ],
    category: TimelineCategory.SEND_DIGITAL_PROGRESS,
    details: {
      recIndex: 0,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'notifichedigitali-uat@pec.pagopa.it',
      },
      deliveryDetailCode: 'C001',
    },
    index: 10,
    hidden: false,
  },
  {
    elementId:
      'DIGITAL_PROG.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0.IDX_1',
    timestamp: '2023-08-25T09:35:50.895375375Z',
    legalFactsIds: [
      {
        key: 'PN_EXTERNAL_LEGAL_FACTS-10446363e8904ff9b93cc1835e8f6253.xml',
        category: LegalFactType.PEC_RECEIPT,
      },
    ],
    category: TimelineCategory.SEND_DIGITAL_PROGRESS,
    details: {
      recIndex: 1,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'testpagopa3@pec.pagopa.it',
      },
      deliveryDetailCode: 'C001',
    },
    index: 11,
    hidden: false,
  },
  {
    elementId:
      'SEND_DIGITAL_FEEDBACK.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
    timestamp: '2023-08-25T09:35:58.40995459Z',
    legalFactsIds: [
      {
        key: 'PN_EXTERNAL_LEGAL_FACTS-d0b33189dcb24f51bdd50363e14c001d.xml',
        category: LegalFactType.PEC_RECEIPT,
      },
    ],
    category: TimelineCategory.SEND_DIGITAL_FEEDBACK,
    details: {
      recIndex: 0,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'notifichedigitali-uat@pec.pagopa.it',
      },
      responseStatus: ResponseStatus.OK,
      deliveryDetailCode: 'C003',
    },
    index: 12,
    hidden: false,
  },
  {
    elementId: 'SCHEDULE_REFINEMENT_WORKFLOW.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
    timestamp: '2023-08-25T09:36:00.079496693Z',
    category: TimelineCategory.SCHEDULE_REFINEMENT,
    details: {
      recIndex: 0,
    },
    index: 13,
    hidden: true,
  },
  {
    elementId:
      'SEND_DIGITAL_FEEDBACK.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
    timestamp: '2023-08-25T09:36:01.184038269Z',
    legalFactsIds: [
      {
        key: 'PN_EXTERNAL_LEGAL_FACTS-3d98741cbeeb4712a3fc709261f83241.xml',
        category: LegalFactType.PEC_RECEIPT,
      },
    ],
    category: TimelineCategory.SEND_DIGITAL_FEEDBACK,
    details: {
      recIndex: 1,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'testpagopa3@pec.pagopa.it',
      },
      responseStatus: ResponseStatus.OK,
      deliveryDetailCode: 'C003',
    },
    index: 14,
    hidden: false,
  },
  {
    elementId: 'SCHEDULE_REFINEMENT_WORKFLOW.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
    timestamp: '2023-08-25T09:36:02.927741692Z',
    category: TimelineCategory.SCHEDULE_REFINEMENT,
    details: {
      recIndex: 1,
    },
    index: 15,
    hidden: true,
  },
  {
    elementId: 'DIGITAL_SUCCESS_WORKFLOW.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
    timestamp: '2023-08-25T09:36:17.520532258Z',
    legalFactsIds: [
      {
        key: 'PN_LEGAL_FACTS-4ba554c616344022838ff39a617ab0df.pdf',
        category: LegalFactType.DIGITAL_DELIVERY,
      },
    ],
    category: TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
    details: {
      recIndex: 0,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'notifichedigitali-uat@pec.pagopa.it',
      },
    },
    index: 16,
    hidden: true,
  },
  {
    elementId: 'DIGITAL_SUCCESS_WORKFLOW.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
    timestamp: '2023-08-25T09:36:17.545859567Z',
    legalFactsIds: [
      {
        key: 'PN_LEGAL_FACTS-b7d638d7b3eb407fac78160b7e1e92d5.pdf',
        category: LegalFactType.DIGITAL_DELIVERY,
      },
    ],
    category: TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
    details: {
      recIndex: 1,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'testpagopa3@pec.pagopa.it',
      },
    },
    index: 17,
    hidden: true,
  },
  {
    elementId: 'REFINEMENT.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
    timestamp: '2023-08-25T09:39:07.843258714Z',
    category: TimelineCategory.REFINEMENT,
    details: {
      recIndex: 0,
    },
    index: 18,
    hidden: true,
  },
  {
    elementId: 'REFINEMENT.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
    timestamp: '2023-08-25T09:39:07.855372374Z',
    category: TimelineCategory.REFINEMENT,
    details: {
      recIndex: 1,
    },
    index: 19,
    hidden: true,
  },
  {
    elementId:
      'NOTIFICATION_PAID.IUN_RTRD-UDGU-QTQY-202308-P-1.CODE_PPA30201169295602908877777777777',
    timestamp: '2023-08-25T11:36:32.24Z',
    category: TimelineCategory.PAYMENT,
    details: {
      recIndex: 0,
      recipientType: RecipientType.PF,
      amount: 200,
      creditorTaxId: '77777777777',
      noticeCode: '302011692956029088',
      paymentSourceChannel: 'PA',
    },
    index: 20,
    hidden: true,
  },
  {
    elementId:
      'NOTIFICATION_PAID.IUN_RTRD-UDGU-QTQY-202308-P-1.CODE_PPA30201169295602909677777777777',
    timestamp: '2023-08-25T11:38:05.392Z',
    category: TimelineCategory.PAYMENT,
    details: {
      recIndex: 1,
      recipientType: RecipientType.PF,
      amount: 5000,
      creditorTaxId: '77777777777',
      noticeCode: '302011692956029096',
      paymentSourceChannel: 'PA',
    },
    index: 21,
    hidden: true,
  },
];

const notificationStatusHistory: Array<NotificationStatusHistory> = [
  {
    status: NotificationStatus.EFFECTIVE_DATE,
    activeFrom: '2023-08-25T09:39:07.843258714Z',
    relatedTimelineElements: [
      'REFINEMENT.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
      'REFINEMENT.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
      'NOTIFICATION_PAID.IUN_RTRD-UDGU-QTQY-202308-P-1.CODE_PPA30201169295602908877777777777',
      'NOTIFICATION_PAID.IUN_RTRD-UDGU-QTQY-202308-P-1.CODE_PPA30201169295602909677777777777',
    ],
    steps: [
      {
        elementId:
          'NOTIFICATION_PAID.IUN_RTRD-UDGU-QTQY-202308-P-1.CODE_PPA30201169295602909677777777777',
        timestamp: '2023-08-25T11:38:05.392Z',
        category: TimelineCategory.PAYMENT,
        details: {
          recIndex: 1,
          recipientType: RecipientType.PF,
          amount: 5000,
          creditorTaxId: '77777777777',
          noticeCode: '302011692956029096',
          paymentSourceChannel: 'PA',
        },
        index: 21,
        hidden: true,
      },
      {
        elementId:
          'NOTIFICATION_PAID.IUN_RTRD-UDGU-QTQY-202308-P-1.CODE_PPA30201169295602908877777777777',
        timestamp: '2023-08-25T11:36:32.24Z',
        category: TimelineCategory.PAYMENT,
        details: {
          recIndex: 0,
          recipientType: RecipientType.PF,
          amount: 200,
          creditorTaxId: '77777777777',
          noticeCode: '302011692956029088',
          paymentSourceChannel: 'PA',
        },
        index: 20,
        hidden: true,
      },
      {
        elementId: 'REFINEMENT.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
        timestamp: '2023-08-25T09:39:07.855372374Z',
        category: TimelineCategory.REFINEMENT,
        details: {
          recIndex: 1,
        },
        index: 19,
        hidden: true,
      },
      {
        elementId: 'REFINEMENT.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
        timestamp: '2023-08-25T09:39:07.843258714Z',
        category: TimelineCategory.REFINEMENT,
        details: {
          recIndex: 0,
        },
        index: 18,
        hidden: true,
      },
    ],
  },
  {
    status: NotificationStatus.DELIVERED,
    activeFrom: '2023-08-25T09:36:02.708723361Z',
    relatedTimelineElements: [
      'DIGITAL_DELIVERY_CREATION_REQUEST.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
      'SCHEDULE_REFINEMENT_WORKFLOW.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
      'DIGITAL_SUCCESS_WORKFLOW.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
      'DIGITAL_SUCCESS_WORKFLOW.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
    ],
    steps: [
      {
        elementId: 'DIGITAL_SUCCESS_WORKFLOW.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
        timestamp: '2023-08-25T09:36:17.545859567Z',
        legalFactsIds: [
          {
            key: 'PN_LEGAL_FACTS-b7d638d7b3eb407fac78160b7e1e92d5.pdf',
            category: LegalFactType.DIGITAL_DELIVERY,
          },
        ],
        category: TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
        details: {
          recIndex: 1,
          digitalAddress: {
            type: DigitalDomicileType.PEC,
            address: 'testpagopa3@pec.pagopa.it',
          },
        },
        index: 17,
        hidden: true,
      },
      {
        elementId: 'DIGITAL_SUCCESS_WORKFLOW.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
        timestamp: '2023-08-25T09:36:17.520532258Z',
        legalFactsIds: [
          {
            key: 'PN_LEGAL_FACTS-4ba554c616344022838ff39a617ab0df.pdf',
            category: LegalFactType.DIGITAL_DELIVERY,
          },
        ],
        category: TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
        details: {
          recIndex: 0,
          digitalAddress: {
            type: DigitalDomicileType.PEC,
            address: 'notifichedigitali-uat@pec.pagopa.it',
          },
        },
        index: 16,
        hidden: true,
      },
      {
        elementId: 'SCHEDULE_REFINEMENT_WORKFLOW.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
        timestamp: '2023-08-25T09:36:02.927741692Z',
        category: TimelineCategory.SCHEDULE_REFINEMENT,
        details: {
          recIndex: 1,
        },
        index: 15,
        hidden: true,
      },
    ],
    deliveryMode: NotificationDeliveryMode.DIGITAL,
  },
  {
    status: NotificationStatus.DELIVERING,
    activeFrom: '2023-08-25T09:35:37.972607129Z',
    relatedTimelineElements: [
      'SEND_DIGITAL.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
      'SEND_DIGITAL.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
      'DIGITAL_PROG.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0.IDX_1',
      'DIGITAL_PROG.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0.IDX_1',
      'SEND_DIGITAL_FEEDBACK.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
      'DIGITAL_DELIVERY_CREATION_REQUEST.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
      'SCHEDULE_REFINEMENT_WORKFLOW.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
      'SEND_DIGITAL_FEEDBACK.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
    ],
    steps: [
      {
        elementId:
          'SEND_DIGITAL_FEEDBACK.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
        timestamp: '2023-08-25T09:36:01.184038269Z',
        legalFactsIds: [
          {
            key: 'PN_EXTERNAL_LEGAL_FACTS-3d98741cbeeb4712a3fc709261f83241.xml',
            category: LegalFactType.PEC_RECEIPT,
          },
        ],
        category: TimelineCategory.SEND_DIGITAL_FEEDBACK,
        details: {
          recIndex: 1,
          digitalAddress: {
            type: DigitalDomicileType.PEC,
            address: 'testpagopa3@pec.pagopa.it',
          },
          responseStatus: ResponseStatus.OK,
          deliveryDetailCode: 'C003',
        },
        index: 14,
        hidden: false,
      },
      {
        elementId: 'SCHEDULE_REFINEMENT_WORKFLOW.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
        timestamp: '2023-08-25T09:36:00.079496693Z',
        category: TimelineCategory.SCHEDULE_REFINEMENT,
        details: {
          recIndex: 0,
        },
        index: 13,
        hidden: true,
      },
      {
        elementId:
          'SEND_DIGITAL_FEEDBACK.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
        timestamp: '2023-08-25T09:35:58.40995459Z',
        legalFactsIds: [
          {
            key: 'PN_EXTERNAL_LEGAL_FACTS-d0b33189dcb24f51bdd50363e14c001d.xml',
            category: LegalFactType.PEC_RECEIPT,
          },
        ],
        category: TimelineCategory.SEND_DIGITAL_DOMICILE,
        details: {
          recIndex: 0,
          digitalAddress: {
            type: DigitalDomicileType.PEC,
            address: 'notifichedigitali-uat@pec.pagopa.it',
          },
          responseStatus: ResponseStatus.OK,
          deliveryDetailCode: 'C003',
        },
        index: 12,
        hidden: false,
      },
      {
        elementId:
          'DIGITAL_PROG.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0.IDX_1',
        timestamp: '2023-08-25T09:35:50.895375375Z',
        legalFactsIds: [
          {
            key: 'PN_EXTERNAL_LEGAL_FACTS-10446363e8904ff9b93cc1835e8f6253.xml',
            category: LegalFactType.PEC_RECEIPT,
          },
        ],
        category: TimelineCategory.SEND_DIGITAL_PROGRESS,
        details: {
          recIndex: 1,
          digitalAddress: {
            type: DigitalDomicileType.PEC,
            address: 'testpagopa3@pec.pagopa.it',
          },
          deliveryDetailCode: 'C001',
        },
        index: 11,
        hidden: false,
      },
      {
        elementId:
          'DIGITAL_PROG.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0.IDX_1',
        timestamp: '2023-08-25T09:35:48.01877805Z',
        legalFactsIds: [
          {
            key: 'PN_EXTERNAL_LEGAL_FACTS-bf46b5cb7617404095595a4ed53a4022.xml',
            category: LegalFactType.PEC_RECEIPT,
          },
        ],
        category: TimelineCategory.SEND_DIGITAL_PROGRESS,
        details: {
          recIndex: 0,
          digitalAddress: {
            type: DigitalDomicileType.PEC,
            address: 'notifichedigitali-uat@pec.pagopa.it',
          },
          deliveryDetailCode: 'C001',
        },
        index: 10,
        hidden: false,
      },
      {
        elementId:
          'SEND_DIGITAL.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
        timestamp: '2023-08-25T09:35:40.989759156Z',
        category: TimelineCategory.SEND_DIGITAL_DOMICILE,
        details: {
          recIndex: 1,
          digitalAddress: {
            type: DigitalDomicileType.PEC,
            address: 'testpagopa3@pec.pagopa.it',
          },
        },
        index: 9,
        hidden: false,
      },
      {
        elementId:
          'SEND_DIGITAL.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
        timestamp: '2023-08-25T09:35:37.972607129Z',
        category: TimelineCategory.SEND_DIGITAL_DOMICILE,
        details: {
          recIndex: 0,
          digitalAddress: {
            type: DigitalDomicileType.PEC,
            address: 'notifichedigitali-uat@pec.pagopa.it',
          },
        },
        index: 8,
        hidden: false,
      },
      {
        elementId: 'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
        timestamp: '2023-08-25T09:35:37.467148235Z',
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 1,
        },
        legalFactsIds: [],
        index: 7,
        hidden: true,
      },
      {
        elementId: 'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
        timestamp: '2023-08-25T09:35:37.459264115Z',
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 0,
        },
        legalFactsIds: [],
        index: 6,
        hidden: true,
      },
      {
        elementId: 'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_PLATFORM.ATTEMPT_0',
        timestamp: '2023-08-25T09:35:37.438177621Z',
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 1,
        },
        legalFactsIds: [],
        index: 5,
        hidden: true,
      },
      {
        elementId: 'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
        timestamp: '2023-08-25T09:35:37.430018585Z',
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 0,
        },
        legalFactsIds: [],
        index: 4,
        hidden: true,
      },
      {
        elementId:
          'SEND_COURTESY_MESSAGE.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.COURTESYADDRESSTYPE_SMS',
        timestamp: '2023-08-25T09:35:28.673819084Z',
        category: TimelineCategory.SEND_COURTESY_MESSAGE,
        details: {
          recIndex: 0,
          digitalAddress: {
            type: DigitalDomicileType.SMS,
            address: '+393889533897',
          },
        },
        legalFactsIds: [],
        index: 3,
        hidden: false,
      },
      {
        elementId: 'AAR_GEN.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
        timestamp: '2023-08-25T09:35:27.34501351Z',
        category: TimelineCategory.AAR_GENERATION,
        details: {
          recIndex: 0,
        },
        legalFactsIds: [],
        index: 2,
        hidden: true,
      },
      {
        elementId: 'AAR_GEN.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
        timestamp: '2023-08-25T09:35:27.328299384Z',
        category: TimelineCategory.AAR_GENERATION,
        details: {
          recIndex: 1,
        },
        legalFactsIds: [],
        index: 1,
        hidden: true,
      },
      {
        elementId: 'REQUEST_ACCEPTED.IUN_RTRD-UDGU-QTQY-202308-P-1',
        timestamp: '2023-08-25T09:34:58.041398918Z',
        legalFactsIds: [],
        category: TimelineCategory.REQUEST_ACCEPTED,
        details: {},
        index: 0,
        hidden: true,
      },
    ],
  },
  {
    status: NotificationStatus.ACCEPTED,
    activeFrom: '2023-08-25T09:33:58.709695008Z',
    relatedTimelineElements: [
      'REQUEST_ACCEPTED.IUN_RTRD-UDGU-QTQY-202308-P-1',
      'AAR_CREATION_REQUEST.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
      'AAR_CREATION_REQUEST.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
      'AAR_GEN.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
      'AAR_GEN.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
      'SEND_COURTESY_MESSAGE.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.COURTESYADDRESSTYPE_SMS',
      'PROBABLE_SCHEDULING_ANALOG_DATE.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
      'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
      'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_PLATFORM.ATTEMPT_0',
      'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
      'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
    ],
    steps: [
      {
        elementId: 'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
        timestamp: '2023-08-25T09:35:37.467148235Z',
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 1,
        },
        legalFactsIds: [],
        index: 7,
        hidden: true,
      },
      {
        elementId: 'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
        timestamp: '2023-08-25T09:35:37.459264115Z',
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 0,
        },
        legalFactsIds: [],
        index: 6,
        hidden: true,
      },
      {
        elementId: 'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_PLATFORM.ATTEMPT_0',
        timestamp: '2023-08-25T09:35:37.438177621Z',
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 1,
        },
        legalFactsIds: [],
        index: 5,
        hidden: true,
      },
      {
        elementId: 'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
        timestamp: '2023-08-25T09:35:37.430018585Z',
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 0,
        },
        legalFactsIds: [],
        index: 4,
        hidden: true,
      },
      {
        elementId:
          'SEND_COURTESY_MESSAGE.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.COURTESYADDRESSTYPE_SMS',
        timestamp: '2023-08-25T09:35:28.673819084Z',
        category: TimelineCategory.SEND_COURTESY_MESSAGE,
        details: {
          recIndex: 0,
          digitalAddress: {
            type: DigitalDomicileType.SMS,
            address: '+393889533897',
          },
        },
        legalFactsIds: [],
        index: 3,
        hidden: true,
      },
      {
        elementId: 'AAR_GEN.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
        timestamp: '2023-08-25T09:35:27.34501351Z',
        category: TimelineCategory.AAR_GENERATION,
        details: {
          recIndex: 0,
        },
        legalFactsIds: [],
        index: 2,
        hidden: true,
      },
      {
        elementId: 'AAR_GEN.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
        timestamp: '2023-08-25T09:35:27.328299384Z',
        category: TimelineCategory.AAR_GENERATION,
        details: {
          recIndex: 1,
        },
        legalFactsIds: [],
        index: 1,
        hidden: true,
      },
      {
        elementId: 'REQUEST_ACCEPTED.IUN_RTRD-UDGU-QTQY-202308-P-1',
        timestamp: '2023-08-25T09:34:58.041398918Z',
        legalFactsIds: [],
        category: TimelineCategory.REQUEST_ACCEPTED,
        details: {},
        index: 0,
        hidden: true,
      },
    ],
  },
];

const paymentsPagoPa: Array<NotificationDetailPayment> = [
  {
    pagoPa: {
      creditorTaxId: '77777777777',
      noticeCode: '302011689142547191',
      applyCost: true,
      attachment: {
        digests: {
          sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlE=',
        },
        contentType: 'application/pdf',
        ref: {
          key: 'PN_NOTIFICATION_ATTACHMENTS-4727f193467c4c5cb26a848f0ea5aee0.pdf',
          versionToken: 'v1',
        },
      },
    },
  },
  {
    pagoPa: {
      creditorTaxId: '77777777777',
      noticeCode: '302011689142547192',
      applyCost: true,
      attachment: {
        digests: {
          sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlA=',
        },
        contentType: 'application/pdf',
        ref: {
          key: 'PN_NOTIFICATION_ATTACHMENTS-4727f193467c4c5cb26a848f0ea5aee1.pdf',
          versionToken: 'v1',
        },
      },
    },
  },
  {
    pagoPa: {
      creditorTaxId: '77777777777',
      noticeCode: '302011689142547193',
      applyCost: true,
      attachment: {
        digests: {
          sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlA=',
        },
        contentType: 'application/pdf',
        ref: {
          key: 'PN_NOTIFICATION_ATTACHMENTS-4727f193467c4c5cb26a848f0ea5aee2.pdf',
          versionToken: 'v1',
        },
      },
    },
  },
  {
    pagoPa: {
      creditorTaxId: '77777777777',
      noticeCode: '302011689142547194',
      applyCost: true,
      attachment: {
        digests: {
          sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlA=',
        },
        contentType: 'application/pdf',
        ref: {
          key: 'PN_NOTIFICATION_ATTACHMENTS-4727f193467c4c5cb26a848f0ea5aee3.pdf',
          versionToken: 'v1',
        },
      },
    },
  },
  {
    pagoPa: {
      creditorTaxId: '77777777777',
      noticeCode: '302011689142547195',
      applyCost: true,
      attachment: {
        digests: {
          sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlA=',
        },
        contentType: 'application/pdf',
        ref: {
          key: 'PN_NOTIFICATION_ATTACHMENTS-4727f193467c4c5cb26a848f0ea5aee4.pdf',
          versionToken: 'v1',
        },
      },
    },
  },
  {
    pagoPa: {
      creditorTaxId: '77777777777',
      noticeCode: '302011689142547196',
      applyCost: true,
      attachment: {
        digests: {
          sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlA=',
        },
        contentType: 'application/pdf',
        ref: {
          key: 'PN_NOTIFICATION_ATTACHMENTS-4727f193467c4c5cb26a848f0ea5aee5.pdf',
          versionToken: 'v1',
        },
      },
    },
  },
  {
    pagoPa: {
      creditorTaxId: '77777777777',
      noticeCode: '302011689142547197',
      applyCost: true,
    },
  },
];

const paymentsPagoPaF24: Array<NotificationDetailPayment> = [
  {
    pagoPa: {
      creditorTaxId: '77777777777',
      noticeCode: '302011686772695133',
      applyCost: true,
      attachment: {
        digests: {
          sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlA=',
        },
        contentType: 'application/pdf',
        ref: {
          key: 'PN_NOTIFICATION_ATTACHMENTS-5641ed2bc57442fb3df53abe5b5d38d.pdf',
          versionToken: 'v1',
        },
      },
    },
    f24: {
      title: 'F24 prima rata TARI',
      applyCost: false,
      metadataAttachment: {
        digests: {
          sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlB=',
        },
        contentType: 'application/pdf',
        ref: {
          key: 'PN_NOTIFICATION_ATTACHMENTS-5641ed2bc57442fb3df53abe5b5d38e.pdf',
          versionToken: 'v1',
        },
      },
    },
  },
  {
    f24: {
      title: 'F24 seconda rata TARI',
      applyCost: false,
      metadataAttachment: {
        digests: {
          sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlC=',
        },
        contentType: 'application/pdf',
        ref: {
          key: 'PN_NOTIFICATION_ATTACHMENTS-5641ed2bc57442fb3df53abe5b5d38f.pdf',
          versionToken: 'v1',
        },
      },
    },
  },
  {
    f24: {
      title: 'F24 terza rata TARI',
      applyCost: false,
      metadataAttachment: {
        digests: {
          sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlD=',
        },
        contentType: 'application/pdf',
        ref: {
          key: 'PN_NOTIFICATION_ATTACHMENTS-5641ed2bc57442fb3df53abe5b5d38g.pdf',
          versionToken: 'v1',
        },
      },
    },
  },
];

export const recipients: Array<NotificationDetailRecipient> = [
  {
    recipientType: RecipientType.PF,
    taxId: 'LVLDAA85T50G702B',
    denomination: 'Mario Cucumber',
    digitalDomicile: {
      type: DigitalDomicileType.PEC,
      address: 'notifichedigitali-uat@pec.pagopa.it',
    },
    physicalAddress: {
      address: 'VIA SENZA NOME',
      addressDetails: 'SCALA B',
      zip: '87100',
      municipality: 'MILANO',
      municipalityDetails: 'MILANO',
      province: 'MI',
      foreignState: 'ITALIA',
    },
    payments: paymentsPagoPaF24,
  },
  {
    recipientType: RecipientType.PF,
    taxId: 'FRMTTR76M06B715E',
    denomination: 'Mario Gherkin',
    digitalDomicile: {
      type: DigitalDomicileType.PEC,
      address: 'testpagopa3@pec.pagopa.it',
    },
    physicalAddress: {
      address: 'VIA SENZA NOME',
      addressDetails: 'SCALA B',
      zip: '87100',
      municipality: 'MILANO',
      municipalityDetails: 'MILANO',
      province: 'MI',
      foreignState: 'ITALIA',
    },
    payments: paymentsPagoPa,
  },
];

export const notificationDTOMultiRecipient: NotificationDetail = {
  abstract: 'Abstract della notifica',
  subject: 'notifica analogica con cucumber',
  recipients,
  documents: [
    {
      digests: {
        sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlE=',
      },
      contentType: 'application/pdf',
      ref: {
        key: 'PN_NOTIFICATION_ATTACHMENTS-abb7804b6e442c8b2223648af970cd1.pdf',
        versionToken: 'v1',
      },
      docIdx: '0',
    },
  ],
  senderDenomination: 'Comune di palermo',
  group: '000',
  iun: 'RTRD-UDGU-QTQY-202308-P-1',
  sentAt: '2023-08-25T09:33:58.709695008Z',
  documentsAvailable: true,
  notificationStatus: NotificationStatus.EFFECTIVE_DATE,
  notificationStatusHistory,
  timeline,
  otherDocuments: [
    {
      recIndex: 1,
      documentId: 'PN_AAR-7e3c456307f743669b42105aa9357dae.pdf',
      documentType: 'AAR',
      title: 'Avviso di avvenuta ricezione - Mario Gherkin (FRMTTR76M06B715E)',
      digests: {
        sha256: '',
      },
      ref: {
        key: '',
        versionToken: '',
      },
      contentType: '',
    },
    {
      recIndex: 0,
      documentId: 'PN_AAR-6dc9aa2aceec4a18b4b073df09a1ed12.pdf',
      documentType: 'AAR',
      title: 'Avviso di avvenuta ricezione - Mario Cucumber (LVLDAA85T50G702B)',
      digests: {
        sha256: '',
      },
      ref: {
        key: '',
        versionToken: '',
      },
      contentType: '',
    },
  ],
};

export const raddNotificationDTOMultiRecipient: NotificationDetail = {
  ...notificationDTOMultiRecipient,
  timeline: [
    ...notificationDTOMultiRecipient.timeline,
    {
      elementId: 'NOTIFICATION_RADD_RETRIEVED_mock',
      timestamp: '2022-06-21T11:44:28Z',
      legalFactsIds: [],
      category: TimelineCategory.NOTIFICATION_RADD_RETRIEVED,
      details: {
        recIndex: 1,
        eventTimestamp: '2022-06-21T11:44:28Z',
      },
    },
  ],
  radd: {
    elementId: 'NOTIFICATION_RADD_RETRIEVED_mock',
    timestamp: '2022-06-21T11:44:28Z',
    legalFactsIds: [],
    category: TimelineCategory.NOTIFICATION_RADD_RETRIEVED,
    details: {
      recIndex: 1,
      eventTimestamp: '2022-06-21T11:44:28Z',
    },
  },
};

export const notificationDTO = getOneRecipientNotification();

export const raddNotificationDTO: NotificationDetail = {
  ...notificationDTO,
  timeline: [
    ...notificationDTO.timeline,
    {
      elementId: 'NOTIFICATION_RADD_RETRIEVED_mock',
      timestamp: '2022-06-21T11:44:28Z',
      legalFactsIds: [],
      category: TimelineCategory.NOTIFICATION_RADD_RETRIEVED,
      details: {
        recIndex: 0,
        eventTimestamp: '2022-06-21T11:44:28Z',
      },
    },
  ],
  radd: {
    elementId: 'NOTIFICATION_RADD_RETRIEVED_mock',
    timestamp: '2022-06-21T11:44:28Z',
    legalFactsIds: [],
    category: TimelineCategory.NOTIFICATION_RADD_RETRIEVED,
    details: {
      recIndex: 0,
      eventTimestamp: '2022-06-21T11:44:28Z',
    },
  },
};

export const raddNotificationMultiRecipientDTO: NotificationDetail = {
  ...notificationDTOMultiRecipient,
  timeline: [
    ...notificationDTOMultiRecipient.timeline,
    {
      elementId: 'NOTIFICATION_RADD_RETRIEVED_mock',
      timestamp: '2022-06-21T11:44:28Z',
      legalFactsIds: [],
      category: TimelineCategory.NOTIFICATION_RADD_RETRIEVED,
      details: {
        recIndex: 0,
        eventTimestamp: '2022-06-21T11:44:28Z',
      },
    },
  ],
  radd: {
    elementId: 'NOTIFICATION_RADD_RETRIEVED_mock',
    timestamp: '2022-06-21T11:44:28Z',
    legalFactsIds: [],
    category: TimelineCategory.NOTIFICATION_RADD_RETRIEVED,
    details: {
      recIndex: 1,
      eventTimestamp: '2022-06-21T11:44:28Z',
    },
  },
};

export const cancelledNotificationDTO: NotificationDetail = {
  ...notificationDTO,
  notificationStatusHistory: [
    {
      status: NotificationStatus.CANCELLATION_IN_PROGRESS,
      activeFrom: '2033-08-14T13:42:54.17675939Z',
      relatedTimelineElements: [],
    },
    ...notificationDTO.notificationStatusHistory,
  ],
  timeline: [
    ...notificationDTO.timeline,
    {
      elementId: 'NOTIFICATION_CANCELLATION_REQUEST.HYTD-ERPH-WDUE-202308-H-1',
      timestamp: '2033-08-14T13:42:54.17675939Z',
      legalFactsIds: [],
      category: TimelineCategory.NOTIFICATION_CANCELLATION_REQUEST,
      details: {},
    },
  ],
  notificationStatus: NotificationStatus.CANCELLATION_IN_PROGRESS,
};
