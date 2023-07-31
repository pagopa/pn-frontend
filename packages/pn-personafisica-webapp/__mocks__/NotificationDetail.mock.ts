import _ from 'lodash';
import {
  AddressSource,
  AnalogWorkflowDetails,
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
} from '@pagopa-pn/pn-commons';
import { parseNotificationDetailForRecipient } from '../src/utils/notification.utility';

const payments: Array<NotificationDetailPayment> = [
  {
    pagoPA: {
      creditorTaxId: '302011686772695132',
      noticeCode: '77777777777',
      applyCostFlg: true,
      attachment: {
        digests: {
          sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlE=',
        },
        contentType: 'application/pdf',
        ref: {
          key: 'PN_NOTIFICATION_ATTACHMENTS-5641ed2bc57442fb3df53abe5b5d38c.pdf',
          versionToken: 'v1',
        },
      },
    },
  },
  {
    pagoPA: {
      creditorTaxId: '302011686772695133',
      noticeCode: '77777777777',
      applyCostFlg: true,
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
    f24Data: {
      metadata: 'metadata-mocked',
      description: 'F24 seconda rata TARI',
    },
  },
];

export const recipient: NotificationDetailRecipient = {
  recipientType: RecipientType.PF,
  taxId: 'LVLDAA85T50G702B',
  denomination: 'FAIL-Giacenza-lte10_890',
  physicalAddress: {
    at: 'Presso',
    address: 'VIA@FAIL-GIACENZA-LTE10_890',
    addressDetails: 'SCALA B',
    zip: '87100',
    municipality: 'MILANO',
    municipalityDetails: 'MILANO',
    province: 'MI',
    foreignState: 'ITALIA',
  },
  payments: paymentsPagoPA,
};

const notificationStatusHistory: Array<NotificationStatusHistory> = [
  {
    status: NotificationStatus.ACCEPTED,
    activeFrom: '2023-06-14T19:58:17.27203321Z',
    relatedTimelineElements: [
      'REQUEST_ACCEPTED.IUN_PXPX-PQZU-PHPQ-202306-M-1',
      'AAR_CREATION_REQUEST.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0',
      'AAR_GEN.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0',
      'GET_ADDRESS.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
      'GET_ADDRESS.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
      'GET_ADDRESS.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.SOURCE_GENERAL.ATTEMPT_0',
      'PREPARE_ANALOG_DOMICILE.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.ATTEMPT_0',
    ],
  },
  {
    status: NotificationStatus.DELIVERING,
    activeFrom: '2023-06-14T23:25:46.672440711Z',
    relatedTimelineElements: [
      'SEND_ANALOG_DOMICILE.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.ATTEMPT_0',
      'SEND_ANALOG_PROGRESS.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.ATTEMPT_0.IDX_1',
      'SEND_ANALOG_PROGRESS.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.ATTEMPT_0.IDX_2',
    ],
  },
  {
    status: NotificationStatus.DELIVERED,
    activeFrom: '2023-06-14T23:26:42.401199296Z',
    relatedTimelineElements: ['ANALOG_SUCCESS_WORKFLOW.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0'],
  },
  {
    status: NotificationStatus.VIEWED,
    activeFrom: '2023-06-19T13:51:44.11651144Z',
    relatedTimelineElements: [
      'NOTIFICATION_VIEWED.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0',
      'SEND_ANALOG_PROGRESS.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.ATTEMPT_0.IDX_3',
      'SEND_ANALOG_FEEDBACK.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.ATTEMPT_0',
      'NOTIFICATION_PAID.IUN_PXPX-PQZU-PHPQ-202306-M-1.CODE_PPA30201168677269513277777777777',
    ],
  },
];

const timeline: Array<INotificationDetailTimeline> = [
  {
    elementId: 'REQUEST_ACCEPTED.IUN_PXPX-PQZU-PHPQ-202306-M-1',
    timestamp: '2023-06-14T21:33:07.495352803Z',
    legalFactsIds: [
      {
        key: 'safestorage://PN_LEGAL_FACTS-3ada37cc1b254fafa4849010b8ea0af8.pdf',
        category: LegalFactType.SENDER_ACK,
      },
    ],
    category: TimelineCategory.REQUEST_ACCEPTED,
    details: {},
  },
  {
    elementId: 'AAR_GEN.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0',
    timestamp: '2023-06-14T23:24:43.304018485Z',
    legalFactsIds: [],
    category: TimelineCategory.AAR_GENERATION,
    details: {
      recIndex: 0,
      generatedAarUrl: 'safestorage://PN_AAR-8a5abf02e252438b9fb827dd59580b18.pdf',
      numberOfPages: 1,
    },
  },
  {
    elementId: 'GET_ADDRESS.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
    timestamp: '2023-06-14T23:25:13.396503891Z',
    legalFactsIds: [],
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 0,
      digitalAddressSource: AddressSource.PLATFORM,
      isAvailable: false,
      attemptDate: '2023-06-14T23:25:13.396501469Z',
    },
  },
  {
    elementId: 'GET_ADDRESS.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
    timestamp: '2023-06-14T23:25:13.424988864Z',
    legalFactsIds: [],
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 0,
      digitalAddressSource: AddressSource.SPECIAL,
      isAvailable: false,
      attemptDate: '2023-06-14T23:25:13.424986714Z',
    },
  },
  {
    elementId: 'GET_ADDRESS.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.SOURCE_GENERAL.ATTEMPT_0',
    timestamp: '2023-06-14T23:25:15.776535853Z',
    legalFactsIds: [],
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 0,
      digitalAddressSource: AddressSource.GENERAL,
      isAvailable: false,
      attemptDate: '2023-06-14T23:25:15.776532273Z',
    },
  },
  {
    elementId: 'SEND_ANALOG_DOMICILE.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.ATTEMPT_0',
    timestamp: '2023-06-14T23:25:46.672440711Z',
    legalFactsIds: [],
    category: TimelineCategory.SEND_ANALOG_DOMICILE,
    details: {
      recIndex: 0,
      physicalAddress: {
        at: 'Presso',
        address: 'VIA@FAIL-GIACENZA-LTE10_890',
        addressDetails: 'SCALA B',
        zip: '87100',
        municipality: 'MILANO',
        municipalityDetails: 'MILANO',
        province: 'MI',
        foreignState: 'ITALIA',
      },
      sentAttemptMade: 0,
      serviceLevel: PhysicalCommunicationType.REGISTERED_LETTER_890,
      productType: '890',
      numberOfPages: 3,
    },
  },
  {
    elementId: 'SEND_ANALOG_PROGRESS.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.ATTEMPT_0.IDX_1',
    timestamp: '2023-06-14T23:26:05Z',
    legalFactsIds: [],
    category: TimelineCategory.SEND_ANALOG_PROGRESS,
    details: {
      recIndex: 0,
      notificationDate: '2023-06-14T23:26:05Z',
      deliveryDetailCode: 'CON080',
      sendRequestId: 'SEND_ANALOG_DOMICILE.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.ATTEMPT_0',
      registeredLetterCode: '77435b1b891145b7bc1bd92176a94a75',
    },
  },
  {
    elementId: 'SEND_ANALOG_PROGRESS.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.ATTEMPT_0.IDX_2',
    timestamp: '2023-06-14T23:26:15Z',
    legalFactsIds: [],
    category: TimelineCategory.SEND_ANALOG_PROGRESS,
    details: {
      recIndex: 0,
      notificationDate: '2023-06-14T23:26:15Z',
      deliveryDetailCode: 'RECAG011A',
      sendRequestId: 'SEND_ANALOG_DOMICILE.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.ATTEMPT_0',
      registeredLetterCode: '77435b1b891145b7bc1bd92176a94a75',
    },
  },
  {
    elementId: 'ANALOG_SUCCESS_WORKFLOW.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0',
    timestamp: '2023-06-14T23:26:42.401199296Z',
    legalFactsIds: [],
    category: TimelineCategory.ANALOG_SUCCESS_WORKFLOW,
    details: {
      recIndex: 0,
      physicalAddress: {
        at: 'Presso',
        address: 'VIA@FAIL-GIACENZA-LTE10_890',
        addressDetails: 'SCALA B',
        zip: '87100',
        municipality: 'MILANO',
        municipalityDetails: 'MILANO',
        province: 'MI',
        foreignState: 'ITALIA',
      },
    },
  },
  {
    elementId: 'NOTIFICATION_VIEWED.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0',
    timestamp: '2023-06-19T13:51:44.11651144Z',
    legalFactsIds: [
      {
        key: 'safestorage://PN_LEGAL_FACTS-3ada926f9f24436fab9614580d78d061.pdf',
        category: LegalFactType.RECIPIENT_ACCESS,
      },
    ],
    category: TimelineCategory.NOTIFICATION_VIEWED,
    details: {
      recIndex: 0,
    },
  },
  {
    elementId: 'SEND_ANALOG_PROGRESS.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.ATTEMPT_0.IDX_3',
    timestamp: '2023-06-19T23:26:30Z',
    legalFactsIds: [
      {
        key: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-b563ce70a2fd4563ae04a81a74b716ab.pdf',
        category: LegalFactType.ANALOG_DELIVERY,
      },
    ],
    category: TimelineCategory.SEND_ANALOG_PROGRESS,
    details: {
      recIndex: 0,
      notificationDate: '2023-06-19T23:26:30Z',
      deliveryDetailCode: 'RECAG007B',
      attachments: [
        {
          id: '1',
          documentType: 'Plico',
          url: 'safestorage://PN_EXTERNAL_LEGAL_FACTS-b563ce70a2fd4563ae04a81a74b716ab.pdf',
        },
      ],
      sendRequestId: 'SEND_ANALOG_DOMICILE.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.ATTEMPT_0',
      registeredLetterCode: '77435b1b891145b7bc1bd92176a94a75',
    },
  },
  {
    elementId: 'SEND_ANALOG_FEEDBACK.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.ATTEMPT_0',
    timestamp: '2023-06-19T23:26:35Z',
    legalFactsIds: [],
    category: TimelineCategory.SEND_ANALOG_FEEDBACK,
    details: {
      recIndex: 0,
      physicalAddress: {
        at: 'Presso',
        address: 'VIA@FAIL-GIACENZA-LTE10_890',
        addressDetails: 'SCALA B',
        zip: '87100',
        municipality: 'MILANO',
        municipalityDetails: 'MILANO',
        province: 'MI',
        foreignState: 'ITALIA',
      },
      sentAttemptMade: 0,
      responseStatus: 'OK',
      notificationDate: '2023-06-19T23:26:35Z',
      deliveryDetailCode: 'RECAG007C',
      serviceLevel: 'REGISTERED_LETTER_890',
      sendRequestId: 'SEND_ANALOG_DOMICILE.IUN_PXPX-PQZU-PHPQ-202306-M-1.RECINDEX_0.ATTEMPT_0',
      registeredLetterCode: '77435b1b891145b7bc1bd92176a94a75',
    } as AnalogWorkflowDetails,
  },
  {
    elementId:
      'NOTIFICATION_PAID.IUN_PXPX-PQZU-PHPQ-202306-M-1.CODE_PPA30201168677269513277777777777',
    timestamp: '2023-07-10T15:54:31.874Z',
    legalFactsIds: [],
    category: TimelineCategory.PAYMENT,
    details: {
      recIndex: 0,
      recipientType: RecipientType.PF,
      creditorTaxId: '77777777777',
      noticeCode: '302011686772695132',
      paymentSourceChannel: 'EXTERNAL_REGISTRY',
    },
  },
];

export const notificationDTO: NotificationDetail = {
  abstract: 'Abstract della notifica',
  paProtocolNumber: '302011686772695119',
  subject: 'notifica analogica con cucumber',
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
  notificationFeePolicy: NotificationFeePolicy.FLAT_RATE,
  physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
  senderDenomination: 'Comune di palermo',
  senderTaxId: '80016350821',
  group: '63f359bc72337440a40f537e',
  senderPaId: '5b994d4a-0fa8-47ac-9c7b-354f1d44a1ce',
  iun: 'PXPX-PQZU-PHPQ-202306-M-1',
  sentAt: '2023-06-14T19:58:17.27203321Z',
  documentsAvailable: true,
  notificationStatus: NotificationStatus.VIEWED,
  notificationStatusHistory,
  timeline,
};

export const notificationToFe = parseNotificationDetailForRecipient(
  _.cloneDeep(notificationDTO),
  recipient.taxId,
  []
);
