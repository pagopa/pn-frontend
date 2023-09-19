import _ from 'lodash';

import { Downtime, DowntimeStatus, KnownFunctionality } from '../models';
import {
  AddressSource,
  DigitalDomicileType,
  INotificationDetailTimeline,
  LegalFactType,
  NotificationDetail,
  NotificationDetailRecipient,
  NotificationFeePolicy,
  NotificationStatus,
  NotificationStatusHistory,
  PhysicalCommunicationType,
  RecipientType,
  TimelineCategory,
} from '../types';
import { NotificationDetailTimelineDetails, PaymentHistory } from '../types/NotificationDetail';
import { parseNotificationDetail } from '../utils';

function getOneRecipientNotification(): NotificationDetail {
  const oneRecipientNotification = _.cloneDeep(notificationDTOMultiRecipient);
  oneRecipientNotification.recipients = [oneRecipientNotification.recipients[0]];
  oneRecipientNotification.timeline = oneRecipientNotification.timeline.filter(
    (t) => !t.details.recIndex
  );
  for (const status of oneRecipientNotification.notificationStatusHistory) {
    status.relatedTimelineElements = status.relatedTimelineElements.filter(
      (el) => el.indexOf('RECINDEX_1') === -1
    );
  }
  return oneRecipientNotification;
}

const recipients: Array<NotificationDetailRecipient> = [
  {
    recipientType: RecipientType.PF,
    taxId: 'LVLDAA85T50G702B',
    denomination: 'Mario Cucumber',
    digitalDomicile: {
      type: DigitalDomicileType.PEC,
      address: 'notifichedigitali-uat@pec.pagopa.it',
    },
    physicalAddress: {
      at: 'Presso',
      address: 'VIA SENZA NOME',
      addressDetails: 'SCALA B',
      zip: '87100',
      municipality: 'MILANO',
      municipalityDetails: 'MILANO',
      province: 'MI',
      foreignState: 'ITALIA',
    },
    payment: {
      noticeCode: '302011692956029088',
      creditorTaxId: '77777777777',
      pagoPaForm: {
        digests: {
          sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlE=',
        },
        contentType: 'application/pdf',
        ref: {
          key: 'PN_NOTIFICATION_ATTACHMENTS-2c5f6aaa594f4f0e803efbddf5232c1d.pdf',
          versionToken: 'v1',
        },
      },
    },
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
      at: 'Presso',
      address: 'VIA SENZA NOME',
      addressDetails: 'SCALA B',
      zip: '87100',
      municipality: 'MILANO',
      municipalityDetails: 'MILANO',
      province: 'MI',
      foreignState: 'ITALIA',
    },
    payment: {
      noticeCode: '302011692956029096',
      creditorTaxId: '77777777777',
      pagoPaForm: {
        digests: {
          sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlE=',
        },
        contentType: 'application/pdf',
        ref: {
          key: 'PN_NOTIFICATION_ATTACHMENTS-25cc3a14c824a3e8fdd751d6ce7b7df.pdf',
          versionToken: 'v1',
        },
      },
    },
  },
];

const notificationStatusHistory: Array<NotificationStatusHistory> = [
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
  },
  {
    status: NotificationStatus.EFFECTIVE_DATE,
    activeFrom: '2023-08-25T09:39:07.843258714Z',
    relatedTimelineElements: [
      'REFINEMENT.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
      'REFINEMENT.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
      'NOTIFICATION_PAID.IUN_RTRD-UDGU-QTQY-202308-P-1.CODE_PPA30201169295602908877777777777',
      'NOTIFICATION_PAID.IUN_RTRD-UDGU-QTQY-202308-P-1.CODE_PPA30201169295602909677777777777',
    ],
  },
];

const timeline: Array<INotificationDetailTimeline> = [
  {
    elementId: 'REQUEST_ACCEPTED.IUN_RTRD-UDGU-QTQY-202308-P-1',
    timestamp: '2023-08-25T09:34:58.041398918Z',
    legalFactsIds: [],
    category: TimelineCategory.REQUEST_ACCEPTED,
    details: {},
  },
  {
    elementId: 'AAR_GEN.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
    timestamp: '2023-08-25T09:35:27.328299384Z',
    category: TimelineCategory.AAR_GENERATION,
    details: {
      recIndex: 1,
      generatedAarUrl: 'PN_AAR-7e3c456307f743669b42105aa9357dae.pdf',
      numberOfPages: 1,
    },
    legalFactsIds: [],
  },
  {
    elementId: 'AAR_GEN.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
    timestamp: '2023-08-25T09:35:27.34501351Z',
    category: TimelineCategory.AAR_GENERATION,
    details: {
      recIndex: 0,
      generatedAarUrl: 'PN_AAR-6dc9aa2aceec4a18b4b073df09a1ed12.pdf',
      numberOfPages: 1,
    },
    legalFactsIds: [],
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
      sendDate: '2023-08-25T09:35:28.673626121Z',
    },
    legalFactsIds: [],
  },
  {
    elementId: 'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
    timestamp: '2023-08-25T09:35:37.430018585Z',
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 0,
      digitalAddressSource: AddressSource.PLATFORM,
      isAvailable: false,
      attemptDate: '2023-08-25T09:35:37.430013304Z',
    },
    legalFactsIds: [],
  },
  {
    elementId: 'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_PLATFORM.ATTEMPT_0',
    timestamp: '2023-08-25T09:35:37.438177621Z',
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 1,
      digitalAddressSource: AddressSource.PLATFORM,
      isAvailable: false,
      attemptDate: '2023-08-25T09:35:37.438172821Z',
    },
    legalFactsIds: [],
  },
  {
    elementId: 'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
    timestamp: '2023-08-25T09:35:37.459264115Z',
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 0,
      digitalAddressSource: AddressSource.SPECIAL,
      isAvailable: true,
      attemptDate: '2023-08-25T09:35:37.459259637Z',
    },
    legalFactsIds: [],
  },
  {
    elementId: 'GET_ADDRESS.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
    timestamp: '2023-08-25T09:35:37.467148235Z',
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 1,
      digitalAddressSource: AddressSource.SPECIAL,
      isAvailable: true,
      attemptDate: '2023-08-25T09:35:37.467144969Z',
    },
    legalFactsIds: [],
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
      digitalAddressSource: AddressSource.SPECIAL,
      retryNumber: 0,
    },
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
      digitalAddressSource: AddressSource.SPECIAL,
      retryNumber: 0,
    },
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
      digitalAddressSource: AddressSource.SPECIAL,
      retryNumber: 0,
      notificationDate: '2023-08-25T09:35:49.409272045Z',
      deliveryDetailCode: 'C001',
    },
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
      digitalAddressSource: AddressSource.SPECIAL,
      retryNumber: 0,
      notificationDate: '2023-08-25T09:35:52.20063392Z',
      deliveryDetailCode: 'C001',
    },
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
      digitalAddressSource: AddressSource.SPECIAL,
      responseStatus: 'OK',
      notificationDate: '2023-08-25T09:35:58.40995459Z',
      deliveryDetailCode: 'C003',
    },
  },
  {
    elementId: 'SCHEDULE_REFINEMENT_WORKFLOW.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
    timestamp: '2023-08-25T09:36:00.079496693Z',
    category: TimelineCategory.SCHEDULE_REFINEMENT,
    details: {
      recIndex: 0,
    },
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
      digitalAddressSource: AddressSource.SPECIAL,
      responseStatus: 'OK',
      notificationDate: '2023-08-25T09:36:01.184038269Z',
      deliveryDetailCode: 'C003',
    },
  },
  {
    elementId: 'SCHEDULE_REFINEMENT_WORKFLOW.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
    timestamp: '2023-08-25T09:36:02.927741692Z',
    category: TimelineCategory.SCHEDULE_REFINEMENT,
    details: {
      recIndex: 1,
    },
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
  },
  {
    elementId: 'REFINEMENT.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_0',
    timestamp: '2023-08-25T09:39:07.843258714Z',
    category: TimelineCategory.REFINEMENT,
    details: {
      recIndex: 0,
    },
  },
  {
    elementId: 'REFINEMENT.IUN_RTRD-UDGU-QTQY-202308-P-1.RECINDEX_1',
    timestamp: '2023-08-25T09:39:07.855372374Z',
    category: TimelineCategory.REFINEMENT,
    details: {
      recIndex: 1,
    },
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
  },
];

export const notificationDTOMultiRecipient: NotificationDetail = {
  abstract: 'Abstract della notifica',
  paProtocolNumber: '302011692956029071',
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
  notificationFeePolicy: NotificationFeePolicy.FLAT_RATE,
  physicalCommunicationType: PhysicalCommunicationType.AR_REGISTERED_LETTER,
  senderDenomination: 'Comune di palermo',
  senderTaxId: '80016350821',
  group: '000',
  senderPaId: '5b994d4a-0fa8-47ac-9c7b-354f1d44a1ce',
  iun: 'RTRD-UDGU-QTQY-202308-P-1',
  sentAt: '2023-08-25T09:33:58.709695008Z',
  documentsAvailable: true,
  notificationStatus: NotificationStatus.EFFECTIVE_DATE,
  notificationStatusHistory,
  timeline,
};

export const notificationDTO = getOneRecipientNotification();

export const notificationToFe = parseNotificationDetail(_.cloneDeep(notificationDTO));
export const notificationToFeMultiRecipient = parseNotificationDetail(
  _.cloneDeep(notificationDTOMultiRecipient)
);

export const getTimelineElem = (
  category: TimelineCategory,
  details: NotificationDetailTimelineDetails
): INotificationDetailTimeline => ({
  category,
  elementId: `${category}.IUN_RTRD-UDGU-QTQY-202308-P-1`,
  timestamp: '2023-08-25T11:38:05.392Z',
  details,
});

export const mockPaymentHistory: Array<PaymentHistory> = [
  {
    recipientDenomination: 'Mario Rossi',
    recipientTaxId: 'RSSMRA80A01H501U',
    paymentSourceChannel: 'EXTERNAL_REGISTRY',
    recipientType: RecipientType.PF,
    amount: 10000.45,
    creditorTaxId: '77777777777',
    noticeCode: '302181677769720267',
  },
  {
    recipientDenomination: 'Sara Bianchi',
    recipientTaxId: 'BNCSRA00E44H501J',
    paymentSourceChannel: 'EXTERNAL_REGISTRY',
    recipientType: RecipientType.PF,
    amount: 30.67,
    creditorTaxId: '77777777777',
    noticeCode: '302181677459720267',
    idF24: 'aw345s',
  },
  {
    recipientDenomination: 'Ufficio Tal dei Tali',
    recipientTaxId: '12345678910',
    paymentSourceChannel: 'EXTERNAL_REGISTRY',
    recipientType: RecipientType.PG,
    amount: 65.12,
    creditorTaxId: '77777777777',
    noticeCode: '302181677459720267',
  },
];

export const mockDowntimes: Array<Downtime> = [
  {
    rawFunctionality: KnownFunctionality.NotificationWorkflow,
    knownFunctionality: KnownFunctionality.NotificationWorkflow,
    status: DowntimeStatus.OK,
    startDate: '2022-10-28T10:11:09Z',
    endDate: '2022-10-28T10:18:14Z',
    fileAvailable: true,
  },
  {
    rawFunctionality: KnownFunctionality.NotificationCreate,
    knownFunctionality: KnownFunctionality.NotificationCreate,
    status: DowntimeStatus.OK,
    startDate: '2022-10-23T15:50:04Z',
    endDate: '2022-10-23T15:51:12Z',
    legalFactId: 'some-legal-fact-id',
    fileAvailable: true,
  },
];

export const mockHistory: NotificationStatusHistory[] = [
  {
    status: NotificationStatus.EFFECTIVE_DATE,
    activeFrom: '2022-10-30T13:59:23Z',
    relatedTimelineElements: [],
    steps: [],
  },
  {
    status: NotificationStatus.DELIVERED,
    activeFrom: '2022-10-04T13:56:16Z',
    relatedTimelineElements: [],
    steps: [],
  },
  {
    status: NotificationStatus.DELIVERING,
    activeFrom: '2022-10-04T13:55:52Z',
    relatedTimelineElements: [],
    steps: [],
  },
  {
    status: NotificationStatus.ACCEPTED,
    activeFrom: '2022-10-04T13:54:47Z',
    relatedTimelineElements: [],
    steps: [],
  },
];
