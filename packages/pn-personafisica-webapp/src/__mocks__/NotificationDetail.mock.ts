import * as _ from 'lodash-es';

import {
  INotificationDetailTimeline,
  LegalFactType,
  NotificationDetail,
  NotificationDetailPayment,
  NotificationDetailRecipient,
  NotificationStatus,
  NotificationStatusHistory,
  PaymentCache,
  PaymentsData,
  PhysicalCommunicationType,
  RecipientType,
  ResponseStatus,
  TimelineCategory,
  getF24Payments,
  getPagoPaF24Payments,
  populatePaymentsPagoPaF24,
} from '@pagopa-pn/pn-commons';

import { parseNotificationDetailForRecipient } from '../utility/notification.utility';
import { paymentInfo } from './ExternalRegistry.mock';

export const payments: Array<NotificationDetailPayment> = [
  {
    pagoPa: {
      creditorTaxId: '77777777777',
      noticeCode: '302011686772695132',
      applyCost: false,
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
      title: 'F24 seconda rata TARI',
      applyCost: false,
      metadataAttachment: {
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
  },
  {
    pagoPa: {
      creditorTaxId: '77777777777',
      noticeCode: '302011686772695134',
      applyCost: false,
    },
  },
  {
    pagoPa: {
      creditorTaxId: '77777777777',
      noticeCode: '302011686772695135',
      applyCost: false,
    },
  },
  {
    pagoPa: {
      creditorTaxId: '77777777777',
      noticeCode: '302011686772695136',
      applyCost: true,
    },
  },
  {
    pagoPa: {
      creditorTaxId: '77777777777',
      noticeCode: '302011686772695137',
      applyCost: true,
    },
  },
  {
    f24: {
      title: 'F24 prima rata',
      applyCost: false,
      metadataAttachment: {
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
  },
];

const notificationStatusHistory: Array<NotificationStatusHistory> = [
  {
    status: NotificationStatus.VIEWED,
    activeFrom: '2023-08-23T08:35:27.109686054Z',
    relatedTimelineElements: [
      'NOTIFICATION_VIEWED.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0',
      'NOTIFICATION_VIEWED_CREATION_REQUEST.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0',
      'NOTIFICATION_VIEWED.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
      'NOTIFICATION_VIEWED_CREATION_REQUEST.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
    ],
    steps: [
      {
        elementId: 'NOTIFICATION_VIEWED.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
        timestamp: '2023-08-23T12:38:42.172599701Z',
        legalFactsIds: [
          {
            key: 'PN_LEGAL_FACTS-4751a48146e41819522e4567b13c5a2.pdf',
            category: LegalFactType.RECIPIENT_ACCESS,
          },
        ],
        category: TimelineCategory.NOTIFICATION_VIEWED,
        details: {
          recIndex: 2,
        },
        index: 16,
        hidden: true,
      },
    ],
  },
  {
    status: NotificationStatus.EFFECTIVE_DATE,
    activeFrom: '2023-08-23T07:47:35.995132435Z',
    relatedTimelineElements: [
      'REFINEMENT.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1',
      'REFINEMENT.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
      'SEND_ANALOG_PROGRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0.ATTEMPT_0.IDX_1',
      'SEND_ANALOG_PROGRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0.ATTEMPT_0.IDX_2',
      'SEND_ANALOG_FEEDBACK.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0.ATTEMPT_0',
      'ANALOG_SUCCESS_WORKFLOW.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0',
      'SCHEDULE_REFINEMENT_WORKFLOW.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0',
      'REFINEMENT.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0',
    ],
    steps: [
      {
        elementId: 'REFINEMENT.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
        timestamp: '2023-08-23T07:47:36.05742356Z',
        legalFactsIds: [],
        category: TimelineCategory.REFINEMENT,
        details: {
          recIndex: 2,
        },
        index: 15,
        hidden: true,
      },
    ],
  },
  {
    status: NotificationStatus.DELIVERING,
    activeFrom: '2023-08-23T07:40:47.833137272Z',
    relatedTimelineElements: [
      'REQUEST_ACCEPTED.IUN_DAPQ-LWQV-DKQH-202308-A-1',
      'AAR_CREATION_REQUEST.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1',
      'AAR_CREATION_REQUEST.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0',
      'AAR_CREATION_REQUEST.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
      'AAR_GEN.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
      'AAR_GEN.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0',
      'AAR_GEN.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1',
      'SEND_COURTESY_MESSAGE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0.COURTESYADDRESSTYPE_EMAIL',
      'PROBABLE_SCHEDULING_ANALOG_DATE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0',
      'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
      'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1.SOURCE_PLATFORM.ATTEMPT_0',
      'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.SOURCE_PLATFORM.ATTEMPT_0',
      'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
      'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.SOURCE_SPECIAL.ATTEMPT_0',
      'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
      'NATIONAL_REGISTRY_CALL.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
      'NATIONAL_REGISTRY_CALL.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
      'NATIONAL_REGISTRY_CALL.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
      'NATIONAL_REGISTRY_RESPONSE.CORRELATIONID_NATIONAL_REGISTRY_CALL.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
      'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1.SOURCE_GENERAL.ATTEMPT_0',
      'SCHEDULE_ANALOG_WORKFLOW.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1',
      'NATIONAL_REGISTRY_RESPONSE.CORRELATIONID_NATIONAL_REGISTRY_CALL.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
      'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.SOURCE_GENERAL.ATTEMPT_0',
      'SCHEDULE_ANALOG_WORKFLOW.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
      'PREPARE_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1.ATTEMPT_0',
      'PREPARE_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0',
      'SEND_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1.ATTEMPT_0',
      'SEND_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0',
      'NATIONAL_REGISTRY_RESPONSE.CORRELATIONID_NATIONAL_REGISTRY_CALL.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
      'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0.SOURCE_GENERAL.ATTEMPT_0',
      'SCHEDULE_ANALOG_WORKFLOW.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0',
      'SEND_ANALOG_PROGRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0.IDX_1',
      'SEND_ANALOG_PROGRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1.ATTEMPT_0.IDX_1',
      'SEND_ANALOG_PROGRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0.IDX_2',
      'SEND_ANALOG_PROGRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1.ATTEMPT_0.IDX_2',
      'SEND_ANALOG_FEEDBACK.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1.ATTEMPT_0',
      'SEND_ANALOG_FEEDBACK.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0',
      'ANALOG_SUCCESS_WORKFLOW.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1',
      'SCHEDULE_REFINEMENT_WORKFLOW.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1',
      'ANALOG_SUCCESS_WORKFLOW.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
      'SCHEDULE_REFINEMENT_WORKFLOW.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
      'PREPARE_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0.ATTEMPT_0',
      'SEND_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0.ATTEMPT_0',
    ],
    steps: [
      {
        elementId: 'SCHEDULE_REFINEMENT_WORKFLOW.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
        timestamp: '2023-08-23T07:45:33.897717635Z',
        legalFactsIds: [],
        category: TimelineCategory.SCHEDULE_REFINEMENT,
        details: {
          recIndex: 2,
        },
        index: 14,
        hidden: true,
      },
      {
        elementId: 'ANALOG_SUCCESS_WORKFLOW.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
        timestamp: '2023-08-23T07:45:33.831087008Z',
        legalFactsIds: [],
        category: TimelineCategory.ANALOG_SUCCESS_WORKFLOW,
        details: {
          recIndex: 2,
          physicalAddress: {
            at: '',
            address: 'VIATORINO 15',
            addressDetails: '',
            zip: '20092',
            municipality: 'CINISELLOBALSAMO',
            municipalityDetails: 'CINISELLOBALSAMO',
            province: 'MI',
            foreignState: 'ITALIA',
          },
        },
        index: 13,
        hidden: true,
      },
      {
        elementId: 'SEND_ANALOG_FEEDBACK.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0',
        timestamp: '2023-08-23T07:45:25Z',
        legalFactsIds: [],
        category: TimelineCategory.SEND_ANALOG_FEEDBACK,
        details: {
          recIndex: 2,
          physicalAddress: {
            at: '',
            address: 'VIATORINO 15',
            addressDetails: '',
            zip: '20092',
            municipality: 'CINISELLOBALSAMO',
            municipalityDetails: 'CINISELLOBALSAMO',
            province: 'MI',
            foreignState: 'ITALIA',
          },
          responseStatus: ResponseStatus.OK,
          deliveryDetailCode: 'RECRN001C',
          serviceLevel: PhysicalCommunicationType.AR_REGISTERED_LETTER,
          sendRequestId: 'SEND_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0',
          registeredLetterCode: '646577041cdc46a59ad86cd4033e4921',
        },
        index: 12,
        hidden: false,
      },
      {
        elementId: 'SEND_ANALOG_PROGRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0.IDX_2',
        timestamp: '2023-08-23T07:45:19Z',
        legalFactsIds: [
          {
            key: 'PN_EXTERNAL_LEGAL_FACTS-e944f4be54804c69a5e61621a17b22fb.pdf',
            category: LegalFactType.ANALOG_DELIVERY,
          },
        ],
        category: TimelineCategory.SEND_ANALOG_PROGRESS,
        details: {
          recIndex: 2,
          deliveryDetailCode: 'RECRN001B',
          attachments: [
            {
              id: '0',
              documentType: 'AR',
              url: 'PN_EXTERNAL_LEGAL_FACTS-e944f4be54804c69a5e61621a17b22fb.pdf',
            },
          ],
          sendRequestId: 'SEND_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0',
          registeredLetterCode: '646577041cdc46a59ad86cd4033e4921',
        },
        index: 11,
        hidden: false,
      },
      {
        elementId: 'SEND_ANALOG_PROGRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0.IDX_1',
        timestamp: '2023-08-23T07:45:10Z',
        legalFactsIds: [],
        category: TimelineCategory.SEND_ANALOG_PROGRESS,
        details: {
          recIndex: 2,
          deliveryDetailCode: 'CON080',
          sendRequestId: 'SEND_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0',
          registeredLetterCode: '646577041cdc46a59ad86cd4033e4921',
        },
        index: 10,
        hidden: false,
      },
      {
        elementId: 'SEND_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0',
        timestamp: '2023-08-23T07:40:48.49281686Z',
        legalFactsIds: [],
        category: TimelineCategory.SEND_ANALOG_DOMICILE,
        details: {
          recIndex: 2,
          physicalAddress: {
            address: 'VIATORINO 15',
            zip: '20092',
            municipality: 'CINISELLOBALSAMO',
            municipalityDetails: 'CINISELLOBALSAMO',
            province: 'MI',
            foreignState: 'ITALIA',
          },
          productType: 'AR',
        },
        index: 9,
        hidden: false,
      },
      {
        elementId: 'PREPARE_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0',
        timestamp: '2023-08-23T07:40:45.061648749Z',
        legalFactsIds: [],
        category: TimelineCategory.PREPARE_ANALOG_DOMICILE,
        details: {
          recIndex: 2,
          physicalAddress: {
            at: '',
            address: 'VIATORINO 15',
            addressDetails: '',
            zip: '20092',
            municipality: 'CINISELLOBALSAMO',
            municipalityDetails: 'CINISELLOBALSAMO',
            province: 'MI',
            foreignState: 'ITALIA',
          },
        },
        index: 8,
        hidden: true,
      },
      {
        elementId: 'SCHEDULE_ANALOG_WORKFLOW.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
        timestamp: '2023-08-23T07:40:37.803744183Z',
        legalFactsIds: [],
        category: TimelineCategory.SCHEDULE_ANALOG_WORKFLOW,
        details: {
          recIndex: 2,
        },
        index: 7,
        hidden: true,
      },
      {
        elementId: 'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.SOURCE_GENERAL.ATTEMPT_0',
        timestamp: '2023-08-23T07:40:37.770115085Z',
        legalFactsIds: [],
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 2,
        },
        index: 6,
        hidden: true,
      },
      {
        elementId:
          'NATIONAL_REGISTRY_RESPONSE.CORRELATIONID_NATIONAL_REGISTRY_CALL.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
        timestamp: '2023-08-23T07:40:37.727768001Z',
        legalFactsIds: [],
        category: TimelineCategory.PUBLIC_REGISTRY_RESPONSE,
        details: {
          recIndex: 2,
        },
        index: 5,
        hidden: true,
      },
      {
        elementId:
          'NATIONAL_REGISTRY_CALL.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
        timestamp: '2023-08-23T07:40:35.112444462Z',
        legalFactsIds: [],
        category: TimelineCategory.PUBLIC_REGISTRY_CALL,
        details: {
          recIndex: 2,
        },
        index: 4,
        hidden: true,
      },
      {
        elementId: 'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.SOURCE_SPECIAL.ATTEMPT_0',
        timestamp: '2023-08-23T07:40:34.924030215Z',
        legalFactsIds: [],
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 2,
        },
        index: 3,
        hidden: true,
      },
      {
        elementId: 'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.SOURCE_PLATFORM.ATTEMPT_0',
        timestamp: '2023-08-23T07:40:34.878603762Z',
        legalFactsIds: [],
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 2,
        },
        index: 2,
        hidden: true,
      },
      {
        elementId: 'AAR_GEN.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
        timestamp: '2023-08-23T07:40:24.804602803Z',
        legalFactsIds: [],
        category: TimelineCategory.AAR_GENERATION,
        details: {
          recIndex: 2,
        },
        index: 1,
        hidden: true,
      },
      {
        elementId: 'REQUEST_ACCEPTED.IUN_DAPQ-LWQV-DKQH-202308-A-1',
        timestamp: '2023-08-23T07:39:54.877429741Z',
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
    activeFrom: '2023-08-23T07:38:49.601270863Z',
    relatedTimelineElements: [
      'REQUEST_ACCEPTED.IUN_DAPQ-LWQV-DKQH-202308-A-1',
      'AAR_CREATION_REQUEST.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1',
      'AAR_CREATION_REQUEST.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0',
      'AAR_CREATION_REQUEST.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
      'AAR_GEN.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
      'AAR_GEN.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0',
      'AAR_GEN.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1',
      'SEND_COURTESY_MESSAGE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0.COURTESYADDRESSTYPE_EMAIL',
      'PROBABLE_SCHEDULING_ANALOG_DATE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0',
      'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0.SOURCE_PLATFORM.ATTEMPT_0',
      'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1.SOURCE_PLATFORM.ATTEMPT_0',
      'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.SOURCE_PLATFORM.ATTEMPT_0',
      'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0.SOURCE_SPECIAL.ATTEMPT_0',
      'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.SOURCE_SPECIAL.ATTEMPT_0',
      'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1.SOURCE_SPECIAL.ATTEMPT_0',
      'NATIONAL_REGISTRY_CALL.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_0.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
      'NATIONAL_REGISTRY_CALL.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
      'NATIONAL_REGISTRY_CALL.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
      'NATIONAL_REGISTRY_RESPONSE.CORRELATIONID_NATIONAL_REGISTRY_CALL.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
      'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1.SOURCE_GENERAL.ATTEMPT_0',
      'SCHEDULE_ANALOG_WORKFLOW.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1',
      'NATIONAL_REGISTRY_RESPONSE.CORRELATIONID_NATIONAL_REGISTRY_CALL.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
      'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.SOURCE_GENERAL.ATTEMPT_0',
      'SCHEDULE_ANALOG_WORKFLOW.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
      'PREPARE_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_1.ATTEMPT_0',
      'PREPARE_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0',
    ],
    steps: [
      {
        elementId: 'PREPARE_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0',
        timestamp: '2023-08-23T07:40:45.061648749Z',
        legalFactsIds: [],
        category: TimelineCategory.PREPARE_ANALOG_DOMICILE,
        details: {
          recIndex: 2,
          physicalAddress: {
            at: '',
            address: 'VIATORINO 15',
            addressDetails: '',
            zip: '20092',
            municipality: 'CINISELLOBALSAMO',
            municipalityDetails: 'CINISELLOBALSAMO',
            province: 'MI',
            foreignState: 'ITALIA',
          },
        },
        index: 8,
        hidden: true,
      },
      {
        elementId: 'SCHEDULE_ANALOG_WORKFLOW.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
        timestamp: '2023-08-23T07:40:37.803744183Z',
        legalFactsIds: [],
        category: TimelineCategory.SCHEDULE_ANALOG_WORKFLOW,
        details: {
          recIndex: 2,
        },
        index: 7,
        hidden: true,
      },
      {
        elementId: 'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.SOURCE_GENERAL.ATTEMPT_0',
        timestamp: '2023-08-23T07:40:37.770115085Z',
        legalFactsIds: [],
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 2,
        },
        index: 6,
        hidden: true,
      },
      {
        elementId:
          'NATIONAL_REGISTRY_RESPONSE.CORRELATIONID_NATIONAL_REGISTRY_CALL.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
        timestamp: '2023-08-23T07:40:37.727768001Z',
        legalFactsIds: [],
        category: TimelineCategory.PUBLIC_REGISTRY_RESPONSE,
        details: {
          recIndex: 2,
        },
        index: 5,
        hidden: true,
      },
      {
        elementId:
          'NATIONAL_REGISTRY_CALL.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
        timestamp: '2023-08-23T07:40:35.112444462Z',
        legalFactsIds: [],
        category: TimelineCategory.PUBLIC_REGISTRY_CALL,
        details: {
          recIndex: 2,
        },
        index: 4,
        hidden: true,
      },
      {
        elementId: 'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.SOURCE_SPECIAL.ATTEMPT_0',
        timestamp: '2023-08-23T07:40:34.924030215Z',
        legalFactsIds: [],
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 2,
        },
        index: 3,
        hidden: true,
      },
      {
        elementId: 'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.SOURCE_PLATFORM.ATTEMPT_0',
        timestamp: '2023-08-23T07:40:34.878603762Z',
        legalFactsIds: [],
        category: TimelineCategory.GET_ADDRESS,
        details: {
          recIndex: 2,
        },
        index: 2,
        hidden: true,
      },
      {
        elementId: 'AAR_GEN.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
        timestamp: '2023-08-23T07:40:24.804602803Z',
        legalFactsIds: [],
        category: TimelineCategory.AAR_GENERATION,
        details: {
          recIndex: 2,
        },
        index: 1,
        hidden: true,
      },
      {
        elementId: 'REQUEST_ACCEPTED.IUN_DAPQ-LWQV-DKQH-202308-A-1',
        timestamp: '2023-08-23T07:39:54.877429741Z',
        legalFactsIds: [
          {
            key: 'PN_LEGAL_FACTS-e0f9106c3ca4c1aaa8de73ecbc0eba5.pdf',
            category: LegalFactType.SENDER_ACK,
          },
        ],
        category: TimelineCategory.REQUEST_ACCEPTED,
        details: {},
        index: 0,
        hidden: true,
      },
    ],
  },
];

export const timeline: Array<INotificationDetailTimeline> = [
  {
    elementId: 'REQUEST_ACCEPTED.IUN_DAPQ-LWQV-DKQH-202308-A-1',
    timestamp: '2023-08-23T07:39:54.877429741Z',
    legalFactsIds: [
      {
        key: 'PN_LEGAL_FACTS-e0f9106c3ca4c1aaa8de73ecbc0eba5.pdf',
        category: LegalFactType.SENDER_ACK,
      },
    ],
    category: TimelineCategory.REQUEST_ACCEPTED,
    details: {},
    index: 0,
    hidden: true,
  },
  {
    elementId: 'AAR_GEN.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
    timestamp: '2023-08-23T07:40:24.804602803Z',
    legalFactsIds: [],
    category: TimelineCategory.AAR_GENERATION,
    details: {
      recIndex: 2,
    },
    index: 1,
    hidden: true,
  },
  {
    elementId: 'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.SOURCE_PLATFORM.ATTEMPT_0',
    timestamp: '2023-08-23T07:40:34.878603762Z',
    legalFactsIds: [],
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 2,
    },
    index: 2,
    hidden: true,
  },
  {
    elementId: 'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.SOURCE_SPECIAL.ATTEMPT_0',
    timestamp: '2023-08-23T07:40:34.924030215Z',
    legalFactsIds: [],
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 2,
    },
    index: 3,
    hidden: true,
  },
  {
    elementId:
      'NATIONAL_REGISTRY_CALL.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
    timestamp: '2023-08-23T07:40:35.112444462Z',
    legalFactsIds: [],
    category: TimelineCategory.PUBLIC_REGISTRY_CALL,
    details: {
      recIndex: 2,
    },
    index: 4,
    hidden: true,
  },
  {
    elementId:
      'NATIONAL_REGISTRY_RESPONSE.CORRELATIONID_NATIONAL_REGISTRY_CALL.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.DELIVERYMODE_DIGITAL.CONTACTPHASE_CHOOSE_DELIVERY.ATTEMPT_0',
    timestamp: '2023-08-23T07:40:37.727768001Z',
    legalFactsIds: [],
    category: TimelineCategory.PUBLIC_REGISTRY_RESPONSE,
    details: {
      recIndex: 2,
    },
    index: 5,
    hidden: true,
  },
  {
    elementId: 'GET_ADDRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.SOURCE_GENERAL.ATTEMPT_0',
    timestamp: '2023-08-23T07:40:37.770115085Z',
    legalFactsIds: [],
    category: TimelineCategory.GET_ADDRESS,
    details: {
      recIndex: 2,
    },
    index: 6,
    hidden: true,
  },
  {
    elementId: 'SCHEDULE_ANALOG_WORKFLOW.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
    timestamp: '2023-08-23T07:40:37.803744183Z',
    legalFactsIds: [],
    category: TimelineCategory.SCHEDULE_ANALOG_WORKFLOW,
    details: {
      recIndex: 2,
    },
    index: 7,
    hidden: true,
  },
  {
    elementId: 'PREPARE_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0',
    timestamp: '2023-08-23T07:40:45.061648749Z',
    legalFactsIds: [],
    category: TimelineCategory.PREPARE_ANALOG_DOMICILE,
    details: {
      recIndex: 2,
      physicalAddress: {
        at: '',
        address: 'VIATORINO 15',
        addressDetails: '',
        zip: '20092',
        municipality: 'CINISELLOBALSAMO',
        municipalityDetails: 'CINISELLOBALSAMO',
        province: 'MI',
        foreignState: 'ITALIA',
      },
    },
    index: 8,
    hidden: true,
  },
  {
    elementId: 'SEND_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0',
    timestamp: '2023-08-23T07:40:48.49281686Z',
    legalFactsIds: [],
    category: TimelineCategory.SEND_ANALOG_DOMICILE,
    details: {
      recIndex: 2,
      physicalAddress: {
        address: 'VIATORINO 15',
        zip: '20092',
        municipality: 'CINISELLOBALSAMO',
        municipalityDetails: 'CINISELLOBALSAMO',
        province: 'MI',
        foreignState: 'ITALIA',
      },
      productType: 'AR',
    },
    index: 9,
    hidden: false,
  },
  {
    elementId: 'SEND_ANALOG_PROGRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0.IDX_1',
    timestamp: '2023-08-23T07:45:10Z',
    legalFactsIds: [],
    category: TimelineCategory.SEND_ANALOG_PROGRESS,
    details: {
      recIndex: 2,
      deliveryDetailCode: 'CON080',
      sendRequestId: 'SEND_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0',
      registeredLetterCode: '646577041cdc46a59ad86cd4033e4921',
    },
    index: 10,
    hidden: false,
  },
  {
    elementId: 'SEND_ANALOG_PROGRESS.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0.IDX_2',
    timestamp: '2023-08-23T07:45:19Z',
    legalFactsIds: [
      {
        key: 'PN_EXTERNAL_LEGAL_FACTS-e944f4be54804c69a5e61621a17b22fb.pdf',
        category: LegalFactType.ANALOG_DELIVERY,
      },
    ],
    category: TimelineCategory.SEND_ANALOG_PROGRESS,
    details: {
      recIndex: 2,
      deliveryDetailCode: 'RECRN001B',
      attachments: [
        {
          id: '0',
          documentType: 'AR',
          url: 'PN_EXTERNAL_LEGAL_FACTS-e944f4be54804c69a5e61621a17b22fb.pdf',
        },
      ],
      sendRequestId: 'SEND_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0',
      registeredLetterCode: '646577041cdc46a59ad86cd4033e4921',
    },
    index: 11,
    hidden: false,
  },
  {
    elementId: 'SEND_ANALOG_FEEDBACK.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0',
    timestamp: '2023-08-23T07:45:25Z',
    legalFactsIds: [],
    category: TimelineCategory.SEND_ANALOG_FEEDBACK,
    details: {
      recIndex: 2,
      physicalAddress: {
        at: '',
        address: 'VIATORINO 15',
        addressDetails: '',
        zip: '20092',
        municipality: 'CINISELLOBALSAMO',
        municipalityDetails: 'CINISELLOBALSAMO',
        province: 'MI',
        foreignState: 'ITALIA',
      },
      responseStatus: ResponseStatus.OK,
      deliveryDetailCode: 'RECRN001C',
      serviceLevel: PhysicalCommunicationType.AR_REGISTERED_LETTER,
      sendRequestId: 'SEND_ANALOG_DOMICILE.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2.ATTEMPT_0',
      registeredLetterCode: '646577041cdc46a59ad86cd4033e4921',
    },
    index: 12,
    hidden: false,
  },
  {
    elementId: 'ANALOG_SUCCESS_WORKFLOW.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
    timestamp: '2023-08-23T07:45:33.831087008Z',
    legalFactsIds: [],
    category: TimelineCategory.ANALOG_SUCCESS_WORKFLOW,
    details: {
      recIndex: 2,
      physicalAddress: {
        at: '',
        address: 'VIATORINO 15',
        addressDetails: '',
        zip: '20092',
        municipality: 'CINISELLOBALSAMO',
        municipalityDetails: 'CINISELLOBALSAMO',
        province: 'MI',
        foreignState: 'ITALIA',
      },
    },
    index: 13,
    hidden: true,
  },
  {
    elementId: 'SCHEDULE_REFINEMENT_WORKFLOW.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
    timestamp: '2023-08-23T07:45:33.897717635Z',
    legalFactsIds: [],
    category: TimelineCategory.SCHEDULE_REFINEMENT,
    details: {
      recIndex: 2,
    },
    index: 14,
    hidden: true,
  },
  {
    elementId: 'REFINEMENT.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
    timestamp: '2023-08-23T07:47:36.05742356Z',
    legalFactsIds: [],
    category: TimelineCategory.REFINEMENT,
    details: {
      recIndex: 2,
    },
    index: 15,
    hidden: true,
  },
  {
    elementId: 'NOTIFICATION_VIEWED.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
    timestamp: '2023-08-23T12:38:42.172599701Z',
    legalFactsIds: [
      {
        key: 'PN_LEGAL_FACTS-4751a48146e41819522e4567b13c5a2.pdf',
        category: LegalFactType.RECIPIENT_ACCESS,
      },
    ],
    category: TimelineCategory.NOTIFICATION_VIEWED,
    details: {
      recIndex: 2,
    },
    index: 16,
    hidden: true,
  },
  {
    elementId: 'NOTIFICATION_PAID.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
    timestamp: '2023-08-23T17:38:42.172599701Z',
    legalFactsIds: [],
    category: TimelineCategory.PAYMENT,
    details: {
      recIndex: 0,
      recipientType: RecipientType.PF,
      creditorTaxId: '77777777777',
      noticeCode: '302011686772695132',
      paymentSourceChannel: 'EXTERNAL_REGISTRY',
      amount: 8000,
    },
    index: 17,
    hidden: true,
  },
];

export const recipients: Array<NotificationDetailRecipient> = [
  {
    recipientType: RecipientType.PF,
  } as NotificationDetailRecipient,
  {
    recipientType: RecipientType.PF,
  } as NotificationDetailRecipient,
  {
    recipientType: RecipientType.PF,
    taxId: 'LVLDAA85T50G702B',
    denomination: 'Ada Lovelace',
    physicalAddress: {
      at: '',
      address: 'VIATORINO 15',
      addressDetails: '',
      zip: '20092',
      municipality: 'CINISELLOBALSAMO',
      municipalityDetails: 'CINISELLOBALSAMO',
      province: 'MI',
      foreignState: 'ITALIA',
    },
    payments,
  },
];

export const notificationDTO: NotificationDetail = {
  abstract: 'PAGAMENTO RATA IMU',
  subject: 'Pagamento rata IMU',
  recipients,
  documents: [
    {
      digests: {
        sha256: '7f3Nr8Yhkv4tH40iOrtMr4Y9fPR0vmCCt9BIwvH8fxs=',
      },
      contentType: 'application/pdf',
      ref: {
        key: 'PN_NOTIFICATION_ATTACHMENTS-c433d019acaa485288974021237beb8e.pdf',
        versionToken: 'l0pwhTshqzIIdVKnCqiV1BlQBZA_LC7r',
      },
      title: 'RATA SCADUTA IMU',
      docIdx: '0',
    },
  ],
  senderDenomination: 'Comune di Palermo',
  group: '6467344676f10c7617353c90',
  iun: 'DAPQ-LWQV-DKQH-202308-A-1',
  sentAt: '2023-08-23T07:38:49.601270863Z',
  documentsAvailable: true,
  notificationStatus: NotificationStatus.VIEWED,
  notificationStatusHistory,
  timeline,
  otherDocuments: [
    {
      recIndex: 2,
      documentId: 'PN_AAR-f773e631f0934287999939fefb0b0db6.pdf',
      documentType: 'AAR',
      title: 'Avviso di avvenuta ricezione',
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

export const cancelledNotificationDTO: NotificationDetail = {
  ...notificationDTO,
  notificationStatus: NotificationStatus.CANCELLED,
  timeline: [
    ...notificationDTO.timeline,
    {
      elementId: 'NOTIFICATION_CANCELLED.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2',
      timestamp: '2023-08-23T12:39:00.172599701Z',
      category: TimelineCategory.NOTIFICATION_CANCELLED,
      details: {
        recIndex: 2,
      },
    },
  ],
  notificationStatusHistory: [
    ...notificationDTO.notificationStatusHistory,
    {
      status: NotificationStatus.CANCELLED,
      activeFrom: '2023-08-23T08:42:27.109686054Z',
      relatedTimelineElements: ['NOTIFICATION_CANCELLED.IUN_DAPQ-LWQV-DKQH-202308-A-1.RECINDEX_2'],
    },
  ],
};

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

export const paymentsData: PaymentsData = {
  pagoPaF24: getPagoPaF24Payments(payments, 2),
  f24Only: getF24Payments(payments, 2),
};

export const overrideNotificationMock = (overrideObj: object): NotificationDetail => {
  const notification = { ...notificationDTO, ...overrideObj };
  return parseNotificationDetailForRecipient(notification, 'CGNNMO80A03H501U', []);
};

export const notificationToFe = parseNotificationDetailForRecipient(
  _.cloneDeep(notificationDTO),
  recipients[2].taxId,
  []
);

export const cancelledNotificationToFe = parseNotificationDetailForRecipient(
  _.cloneDeep(cancelledNotificationDTO),
  recipients[2].taxId,
  []
);

export const cachedPayments: PaymentCache = {
  iun: notificationDTO.iun,
  timestamp: new Date().toISOString(),
  currentPaymentPage: 0,
  payments: populatePaymentsPagoPaF24(
    notificationDTO.timeline,
    paymentsData.pagoPaF24,
    paymentInfo
  ),
};
