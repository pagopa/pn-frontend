import {
  DigitalDomicileType,
  formatDate,
  GetNotificationsParams,
  GetNotificationsResponse,
  LegalFactId,
  LegalFactType,
  NotificationDetail,
  NotificationDetailOtherDocument,
  NotificationFeePolicy,
  NotificationStatus,
  PaymentAttachmentNameType,
  PaymentInfo,
  PaymentNotice,
  PhysicalCommunicationType,
  RecipientType,
  TimelineCategory,
} from '@pagopa-pn/pn-commons';
import { AxiosResponse } from 'axios';

import { Delegator } from '../../redux/delegation/types';
import { parseNotificationDetailForRecipient } from '../../utils/notification.utility';
import { NotificationDetailForRecipient } from '../../models/NotificationDetail';
import { NotificationId } from '../../models/Notifications';
import { apiClient } from '../apiClients';
import {
  NOTIFICATIONS_LIST,
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_DETAIL_OTHER_DOCUMENTS,
  NOTIFICATION_ID_FROM_QRCODE,
  NOTIFICATION_PAYMENT_ATTACHMENT,
  NOTIFICATION_PAYMENT_INFO,
  NOTIFICATION_PAYMENT_URL,
} from './notifications.routes';

const getDownloadUrl = (response: AxiosResponse): { url: string } => {
  if (response.data) {
    return response.data as { url: string };
  }
  return { url: '' };
};

const mockedNotificationDetail =     {
  "abstract": "Dritto devi andare!",
  "paProtocolNumber": "3473",
  "subject": "Inadequatezza nel camminare",
  "recipients": [
    {
      "recipientType": RecipientType.PF,
      "taxId": "LVLDAA85T50G702B",
      "internalId": "PF-b32e4920-6ff3-4872-8018-d60a4e5827f9",
      "denomination": "Ada Lovelace",
      "digitalDomicile": {
        "type": DigitalDomicileType.PEC,
        "address": "bel-indirizzo@coso.local.24680357"
      },
      "physicalAddress": {
        "at": "",
        "address": "Via Rosas 1829",
        "addressDetails": "",
        "zip": "98036",
        "municipality": "Graniti",
        "municipalityDetails": "",
        "province": "Messina",
        "foreignState": "Italia"
      }
    }
  ],
  "documents": [
    {
      "digests": {
        "sha256": "F40YJSDrDCLS2iI2L8odiAB1O+JHhAbxNarrhSBQLr8="
      },
      "contentType": "application/pdf",
      "ref": {
        "key": "PN_NOTIFICATION_ATTACHMENTS-0001-Y8QB-T2LQ-0HA4-1FQ0",
        "versionToken": "pYA8W0.wYZzHPlF8Wu86gk_evlozdyUK"
      },
      "title": "Atto primo",
      "docIdx": "0"
    }
  ],
  "notificationFeePolicy": NotificationFeePolicy.FLAT_RATE,
  "physicalCommunicationType": PhysicalCommunicationType.AR_REGISTERED_LETTER,
  "senderDenomination": "Comune di Palermo",
  "senderTaxId": "80016350821",
  "group": "",
  "taxonomyCode": "010102P",
  "senderPaId": "5b994d4a-0fa8-47ac-9c7b-354f1d44a1ce",
  "iun": "KQKX-WMDW-GDMU-202301-L-1",
  "sentAt": "2023-01-26T13:54:47.18027307Z",
  "documentsAvailable": true,
  "notificationStatus": NotificationStatus.VIEWED,
  "notificationStatusHistory": [
    {
      "status": NotificationStatus.ACCEPTED,
      "activeFrom": "2023-01-26T13:54:47.18027307Z",
      "relatedTimelineElements": [
        "KQKX-WMDW-GDMU-202301-L-1_request_accepted",
        "KQKX-WMDW-GDMU-202301-L-1_aar_gen_0",
        "KQKX-WMDW-GDMU-202301-L-1_send_courtesy_message_0_index_0",
        "KQKX-WMDW-GDMU-202301-L-1_send_courtesy_message_0_index_1",
        "KQKX-WMDW-GDMU-202301-L-1_get_address_0_source_PLATFORM_attempt_0"
      ]
    },
    {
      "status": NotificationStatus.DELIVERING,
      "activeFrom": "2023-01-26T13:55:52.651901435Z",
      "relatedTimelineElements": [
        "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_0_source_PLATFORM_attempt_0",
        "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_0_source_PLATFORM_attempt_0_progidx_1",
        "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_0_source_PLATFORM_attempt_0"
      ]
    },
    {
      "status": NotificationStatus.DELIVERED,
      "activeFrom": "2023-01-26T13:57:16.42843144Z",
      "relatedTimelineElements": [
        "KQKX-WMDW-GDMU-202301-L-1_digital_success_workflow_0",
        "KQKX-WMDW-GDMU-202301-L-1_schedule_refinement_workflow_0"
      ]
    },
    {
      "status": NotificationStatus.EFFECTIVE_DATE,
      "activeFrom": "2023-01-26T13:59:23.333432372Z",
      "relatedTimelineElements": ["KQKX-WMDW-GDMU-202301-L-1_refinement_0"]
    },
    {
      "status": NotificationStatus.VIEWED,
      "activeFrom": "2023-01-27T12:14:23.357127847Z",
      "relatedTimelineElements": [
        "KQKX-WMDW-GDMU-202301-L-1_notification_viewed_0"
      ]
    }
  ],
  "timeline": [
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_request_accepted",
      "timestamp": "2023-01-26T13:55:15.975574085Z",
      "legalFactsIds": [
        {
          "key": "safestorage://PN_LEGAL_FACTS-0002-Y8NU-81RH-MWBB-RJ71",
          "category": LegalFactType.SENDER_ACK,
        }
      ],
      "details": {
      },
      "category": TimelineCategory.REQUEST_ACCEPTED
    },
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_aar_gen_0",
      "timestamp": "2023-01-26T13:55:22.715640353Z",
      "legalFactsIds": [],
      "category": TimelineCategory.AAR_GENERATION,
      "details": {
        "recIndex": 0,
        "numberOfPages": 1,
        "generatedAarUrl": "safestorage://PN_AAR-0002-GO6M-7RQG-8PB7-YAER"
      }
    },
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_courtesy_message_0_index_0",
      "timestamp": "2023-01-26T13:55:22.816736941Z",
      "legalFactsIds": [],
      "category": TimelineCategory.SEND_COURTESY_MESSAGE,
      "details": {
        "recIndex": 0,
        "digitalAddress": {
          "type": "EMAIL",
          "address": "manudido99@gmail.com"
        },
        "sendDate": "2023-01-26T13:55:22.816723695Z"
      }
    },
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_courtesy_message_0_index_1",
      "timestamp": "2023-01-26T13:55:22.881938714Z",
      "legalFactsIds": [],
      "category": TimelineCategory.SEND_COURTESY_MESSAGE,
      "details": {
        "recIndex": 0,
        "digitalAddress": {
          "type": "SMS",
          "address": "+3912345678912"
        },
        "sendDate": "2023-01-26T13:55:22.881927028Z"
      }
    },
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_get_address_0_source_PLATFORM_attempt_0",
      "timestamp": "2023-01-26T13:55:52.597019182Z",
      "legalFactsIds": [],
      "category": TimelineCategory.GET_ADDRESS,
      "details": {
        "recIndex": 0,
        "digitalAddressSource": "PLATFORM",
        "isAvailable": true,
        "attemptDate": "2023-01-26T13:55:52.597018417Z"
      }
    },
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_domicile_0_source_PLATFORM_attempt_0",
      "timestamp": "2023-01-26T13:55:52.651901435Z",
      "legalFactsIds": [],
      "category": TimelineCategory.SEND_DIGITAL_DOMICILE,
      "details": {
        "recIndex": 0,
        "digitalAddress": {
          "type": "PEC",
          "address": "manudido99@gmail.com"
        },
        "digitalAddressSource": "PLATFORM",
        "retryNumber": 0
      }
    },
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_delivering_progress_0_source_PLATFORM_attempt_0_progidx_1",
      "timestamp": "2023-01-26T13:56:05.000870007Z",
      "legalFactsIds": [
        {
          "key": "safestorage://PN_EXTERNAL_LEGAL_FACTS-0003-T9NR-EZKL-5V5A-WUAM",
          "category": LegalFactType.PEC_RECEIPT,
        }
      ],
      "category": TimelineCategory.SEND_DIGITAL_PROGRESS,
      "details": {
        "recIndex": 0,
        "digitalAddress": {
          "type": "PEC",
          "address": "manudido99@gmail.com"
        },
        "digitalAddressSource": "PLATFORM",
        "retryNumber": 0,
        "notificationDate": "2023-01-26T13:56:06.224667703Z",
        "sendingReceipts": [{}],
        "eventCode": "C001",
        "shouldRetry": false
      }
    },
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_send_digital_feedback_0_source_PLATFORM_attempt_0",
      "timestamp": "2023-01-26T13:56:15.001161877Z",
      "legalFactsIds": [
        {
          "key": "safestorage://PN_EXTERNAL_LEGAL_FACTS-0003-VXMT-20MV-CBBU-X5MR",
          "category": LegalFactType.PEC_RECEIPT
        }
      ],
      "category": TimelineCategory.SEND_DIGITAL_FEEDBACK,
      "details": {
        "recIndex": 0,
        "digitalAddress": {
          "type": "PEC",
          "address": "manudido99@gmail.com"
        },
        "digitalAddressSource": "PLATFORM",
        "responseStatus": "OK",
        "notificationDate": "2023-01-26T13:56:15.001161877Z",
        "sendingReceipts": [{}]
      }
    },
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_digital_success_workflow_0",
      "timestamp": "2023-01-26T13:57:16.42843144Z",
      "legalFactsIds": [
        {
          "key": "safestorage://PN_LEGAL_FACTS-0002-0HBC-V58A-FT7W-WG8Y",
          "category": LegalFactType.DIGITAL_DELIVERY
        }
      ],
      "category": TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
      "details": {
        "recIndex": 0,
        "digitalAddress": {
          "type": "PEC",
          "address": "manudido99@gmail.com"
        }
      }
    },
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_schedule_refinement_workflow_0",
      "timestamp": "2023-01-26T13:57:16.525827086Z",
      "legalFactsIds": [],
      "category": TimelineCategory.SCHEDULE_REFINEMENT,
      "details": {
        "recIndex": 0
      }
    },
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_refinement_0",
      "timestamp": "2023-01-26T13:59:23.333432372Z",
      "legalFactsIds": [],
      "category": TimelineCategory.REFINEMENT,
      "details": {
        "recIndex": 0,
        "notificationCost": 100
      }
    },
    {
      "elementId": "KQKX-WMDW-GDMU-202301-L-1_notification_viewed_0",
      "timestamp": "2023-01-27T12:14:23.357127847Z",
      "legalFactsIds": [
        {
          "key": "safestorage://PN_LEGAL_FACTS-0002-7LNB-G0E1-2OGO-EEA6",
          "category": LegalFactType.RECIPIENT_ACCESS
        }
      ],
      "category": TimelineCategory.NOTIFICATION_VIEWED,
      "details": {
        "recIndex": 0
      }
    }
  ]
};


export const NotificationsApi = {
  /**
   * Gets current user notifications
   * @param  {string} startDate
   * @param  {string} endDate
   * @returns Promise
   */
  getReceivedNotifications: (params: GetNotificationsParams): Promise<GetNotificationsResponse> =>
    apiClient.get<GetNotificationsResponse>(NOTIFICATIONS_LIST(params)).then((response) => {
      if (response.data && response.data.resultsPage) {
        const notifications = response.data.resultsPage.map((d) => ({
          ...d,
          sentAt: formatDate(d.sentAt),
        }));
        return {
          ...response.data,
          resultsPage: notifications,
        };
      }
      return {
        resultsPage: [],
        moreResult: false,
        nextPagesKey: [],
      };
    }),

  /**
   * Gets current user notification detail
   * @param  {string} iun
   * @param  {string} currentUserTaxId
   * @param  {Array<Delegator>} delegatorsFromStore
   * @param  {string} mandateId
   * @returns Promise
   */
  getReceivedNotification: (
    iun: string,
    currentUserTaxId: string,
    delegatorsFromStore: Array<Delegator>,
    mandateId?: string
  ): Promise<NotificationDetailForRecipient> =>
    iun === "KQKX-WMDW-GDMU-202301-L-1" 
    ? Promise.resolve(parseNotificationDetailForRecipient(
        mockedNotificationDetail,
        currentUserTaxId,
        delegatorsFromStore,
        mandateId
    ))
    : apiClient.get<NotificationDetail>(NOTIFICATION_DETAIL(iun, mandateId)).then((response) => {
      if (response.data) {
        return parseNotificationDetailForRecipient(
          response.data,
          currentUserTaxId,
          delegatorsFromStore,
          mandateId
        );
      } else {
        return {} as NotificationDetailForRecipient;
      }
    }),

  /**
   * Get notification iun and mandate id from aar link
   * @param {string} qrCode
   * @returns Promise
   */
  exchangeNotificationQrCode: (qrCode: string): Promise<NotificationId> =>
    apiClient
      .post<NotificationId>(NOTIFICATION_ID_FROM_QRCODE(), { aarQrCodeValue: qrCode })
      .then((response) => response.data),

  /**
   * Gets current user notification document
   * @param  {string} iun
   * @param  {number} documentIndex
   * @param  {string} mandateId
   * @returns Promise
   */
  getReceivedNotificationDocument: (
    iun: string,
    documentIndex: string,
    mandateId?: string
  ): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex, mandateId))
      .then((response) => getDownloadUrl(response)),

  /**
   *
   * @param  {string} iun
   * @param  {NotificationDetailOtherDocument} otherDocument
   * @returns Promise
   */
  getReceivedNotificationOtherDocument: (
    iun: string,
    otherDocument: NotificationDetailOtherDocument,
    mandateId?: string
  ): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(NOTIFICATION_DETAIL_OTHER_DOCUMENTS(iun, otherDocument), {
        params: { documentId: otherDocument.documentId, mandateId },
      })
      .then((response) => getDownloadUrl(response)),

  /**
   * Gets current user notification legalfact
   * @param  {string} iun
   * @param  {LegalFactId} legalFact
   * @param  {string} mandateId
   * @returns Promise
   */
  getReceivedNotificationLegalfact: (
    iun: string,
    legalFact: LegalFactId,
    mandateId?: string
  ): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact, mandateId))
      .then((response) => getDownloadUrl(response)),

  /**
   * Gets current user specified Payment Attachment
   * @param  {string} iun
   * @param  {PaymentAttachmentNameType} attachmentName
   * @param  {string} mandateId
   * @returns Promise
   */
  getPaymentAttachment: (
    iun: string,
    attachmentName: PaymentAttachmentNameType,
    mandateId?: string
  ): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(
        NOTIFICATION_PAYMENT_ATTACHMENT(iun, attachmentName as string, mandateId)
      )
      .then((response) => getDownloadUrl(response)),

  /**
   * Gets current user's notification payment info
   * @param  {string} noticeCode
   * @param  {string} taxId
   * @returns Promise
   */
  getNotificationPaymentInfo: (noticeCode: string, taxId: string): Promise<PaymentInfo> =>
    apiClient
      .get<PaymentInfo>(NOTIFICATION_PAYMENT_INFO(taxId, noticeCode))
      .then((response) => response.data),

  /**
   * Gets current user's notification payment url
   * @param  {string} noticeCode
   * @param  {string} taxId
   * @returns Promise
   */
  getNotificationPaymentUrl: (
    paymentNotice: PaymentNotice,
    returnUrl: string
  ): Promise<{ checkoutUrl: string }> =>
    apiClient
      .post<{ checkoutUrl: string }>(NOTIFICATION_PAYMENT_URL(), {
        paymentNotice,
        returnUrl,
      })
      .then((response) => response.data),
};
