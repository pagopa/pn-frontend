import {
  AddressSource,
  DigitalDomicileType,
  INotificationDetailTimeline,
  LegalFactType,
  NotificationDetail,
  NotificationDetailPayment,
  NotificationDetailRecipient,
  NotificationFeePolicy,
  NotificationStatus,
  NotificationStatusHistory,
  PhysicalCommunicationType,
  RecipientType,
  TimelineCategory,
  parseNotificationDetail,
} from '@pagopa-pn/pn-commons';

const payments: Array<NotificationDetailPayment> = [
  {
    pagoPA: {
      creditorTaxId: '302011689142547191',
      noticeCode: '77777777777',
      applyCostFlg: true,
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
];

const recipient: NotificationDetailRecipient = {
  recipientType: RecipientType.PG,
  taxId: 'LELPTR04A01C352E',
  denomination: 'Le Epistolae srl',
  digitalDomicile: {
    type: DigitalDomicileType.PEC,
    address: 'testpagopa3@pnpagopa.postecert.local',
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
  payments,
};

const statusHistory: Array<NotificationStatusHistory> = [
  {
    status: NotificationStatus.ACCEPTED,
    activeFrom: '2023-05-09T09:15:49.889569868Z',
    relatedTimelineElements: [
      'REQUEST_ACCEPTED.IUN_AVEJ-AUAT-JUQE-202305-J-1',
      'AAR_CREATION_REQUEST.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0',
      'AAR_GEN.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0',
      'GET_ADDRESS.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
      'GET_ADDRESS.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
    ],
  },
  {
    status: NotificationStatus.DELIVERING,
    activeFrom: '2023-05-09T09:18:58.992430167Z',
    relatedTimelineElements: [
      'SEND_DIGITAL.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
      'DIGITAL_PROG.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0.IDX_1',
      'SEND_DIGITAL_FEEDBACK.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
      'DIGITAL_DELIVERY_CREATION_REQUEST.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0',
    ],
  },
  {
    status: NotificationStatus.DELIVERED,
    activeFrom: '2023-05-09T09:19:28.925761166Z',
    relatedTimelineElements: [
      'DIGITAL_SUCCESS_WORKFLOW.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0',
      'SCHEDULE_REFINEMENT_WORKFLOW.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0',
    ],
  },
  {
    status: NotificationStatus.EFFECTIVE_DATE,
    activeFrom: '2023-05-09T09:22:29.797634844Z',
    relatedTimelineElements: ['REFINEMENT.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0'],
  },
  {
    status: NotificationStatus.VIEWED,
    activeFrom: '2023-05-09T09:23:43.530989727Z',
    relatedTimelineElements: [
      'NOTIFICATION_VIEWED.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0',
      'NOTIFICATION_VIEWED_CREATION_REQUEST.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0',
    ],
  },
];

const timeline: Array<INotificationDetailTimeline> = [
  {
    elementId: 'REQUEST_ACCEPTED.IUN_AVEJ-AUAT-JUQE-202305-J-1',
    timestamp: '2023-05-09T09:17:30.022877699Z',
    legalFactsIds: [
      {
        key: 'safestorage://PN_LEGAL_FACTS-e94b748e1774763a4c56f139491eb8d.pdf',
        category: LegalFactType.SENDER_ACK,
      },
    ],
    category: TimelineCategory.REQUEST_ACCEPTED,
    details: {},
  },
  {
    elementId: 'AAR_GEN.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0',
    timestamp: '2023-05-09T09:18:28.710186997Z',
    legalFactsIds: [],
    category: TimelineCategory.AAR_GENERATION,
    details: {
      recIndex: 0,
      generatedAarUrl: 'safestorage://PN_AAR-2df6d213b4174ff8b939f2d3e6ce3482.pdf',
      numberOfPages: 1,
    },
  },
  {
    elementId: 'GET_ADDRESS.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
    timestamp: '2023-05-09T09:18:58.823594351Z',
    legalFactsIds: [],
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 0,
      digitalAddressSource: AddressSource.PLATFORM,
      isAvailable: false,
      attemptDate: '2023-05-09T09:18:58.823591961Z',
    },
  },
  {
    elementId: 'GET_ADDRESS.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
    timestamp: '2023-05-09T09:18:58.885345464Z',
    legalFactsIds: [],
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 0,
      digitalAddressSource: AddressSource.SPECIAL,
      isAvailable: true,
      attemptDate: '2023-05-09T09:18:58.885342502Z',
    },
  },
  {
    elementId:
      'SEND_DIGITAL.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
    timestamp: '2023-05-09T09:18:58.992430167Z',
    legalFactsIds: [],
    category: TimelineCategory.SEND_DIGITAL_DOMICILE,
    details: {
      recIndex: 0,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'testpagopa3@pnpagopa.postecert.local',
      },
      digitalAddressSource: AddressSource.SPECIAL,
      retryNumber: 0,
    },
  },
  {
    elementId:
      'DIGITAL_PROG.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0.IDX_1',
    timestamp: '2023-05-09T09:19:10.001436548Z',
    legalFactsIds: [
      {
        key: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-7ffafb688f86457384f6862c5d3a4552.xml',
        category: LegalFactType.PEC_RECEIPT,
      },
    ],
    category: TimelineCategory.SEND_DIGITAL_PROGRESS,
    details: {
      recIndex: 0,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'testpagopa3@pnpagopa.postecert.local',
      },
      digitalAddressSource: AddressSource.SPECIAL,
      retryNumber: 0,
      notificationDate: '2023-05-09T09:19:11.216439172Z',
      deliveryDetailCode: 'C001',
    },
  },
  {
    elementId:
      'SEND_DIGITAL_FEEDBACK.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0.SOURCE_SPECIAL.REPEAT_false.ATTEMPT_0',
    timestamp: '2023-05-09T09:19:20.001088565Z',
    legalFactsIds: [
      {
        key: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-3371b7f44da4078b4efff09cd009f60.xml',
        category: LegalFactType.PEC_RECEIPT,
      },
    ],
    category: TimelineCategory.SEND_DIGITAL_FEEDBACK,
    details: {
      recIndex: 0,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'testpagopa3@pnpagopa.postecert.local',
      },
      digitalAddressSource: AddressSource.SPECIAL,
      responseStatus: 'OK',
      notificationDate: '2023-05-09T09:19:20.001088565Z',
      deliveryDetailCode: 'C003',
    },
  },
  {
    elementId: 'DIGITAL_SUCCESS_WORKFLOW.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0',
    timestamp: '2023-05-09T09:19:28.925761166Z',
    legalFactsIds: [
      {
        key: 'safestorage://PN_LEGAL_FACTS-8f7ec24b70694fda922f8a8fd846533e.pdf',
        category: LegalFactType.DIGITAL_DELIVERY,
      },
    ],
    category: TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
    details: {
      recIndex: 0,
      digitalAddress: {
        type: DigitalDomicileType.PEC,
        address: 'testpagopa3@pnpagopa.postecert.local',
      },
    },
  },
  {
    elementId: 'SCHEDULE_REFINEMENT_WORKFLOW.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0',
    timestamp: '2023-05-09T09:19:29.04836619Z',
    legalFactsIds: [],
    category: TimelineCategory.SCHEDULE_REFINEMENT,
    details: {
      recIndex: 0,
    },
  },
  {
    elementId: 'REFINEMENT.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0',
    timestamp: '2023-05-09T09:22:29.797634844Z',
    legalFactsIds: [],
    category: TimelineCategory.REFINEMENT,
    details: {
      recIndex: 0,
    },
  },
  {
    elementId: 'NOTIFICATION_VIEWED.IUN_AVEJ-AUAT-JUQE-202305-J-1.RECINDEX_0',
    timestamp: '2023-05-09T09:23:43.530989727Z',
    legalFactsIds: [
      {
        key: 'safestorage://PN_LEGAL_FACTS-6a5d49cd1e0548b5b64b776a2b910112.pdf',
        category: LegalFactType.RECIPIENT_ACCESS,
      },
    ],
    category: TimelineCategory.NOTIFICATION_VIEWED,
    details: {
      recIndex: 0,
    },
  },
];

export const PG_NOTIFICATION_DTO: NotificationDetail = {
  abstract: 'Abstract della notifica',
  paProtocolNumber: '302011683623745936',
  subject: 'invio notifica con cucumber',
  recipients: [recipient],
  documents: [
    {
      digests: {
        sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlE=',
      },
      contentType: 'application/pdf',
      ref: {
        key: 'PN_NOTIFICATION_ATTACHMENTS-25fc46c294cb4dc48d84eec3005c134c.pdf',
        versionToken: 'v1',
      },
      docIdx: '0',
    },
  ],
  notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE,
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
  senderDenomination: 'Comune di milano',
  senderTaxId: '01199250158',
  group: '62e941d313b0fc6edad4535a',
  senderPaId: '026e8c72-7944-4dcd-8668-f596447fec6d',
  iun: 'AVEJ-AUAT-JUQE-202305-J-1',
  sentAt: '2023-05-09T09:15:49.889569868Z',
  documentsAvailable: true,
  notificationStatus: NotificationStatus.VIEWED,
  notificationStatusHistory: statusHistory,
  timeline,
};

export const notificationToFe = parseNotificationDetail(PG_NOTIFICATION_DTO);
