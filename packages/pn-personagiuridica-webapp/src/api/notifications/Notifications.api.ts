import {
  formatDate,
  GetNotificationsParams,
  GetNotificationsResponse,
  INotificationDetailTimeline,
  LegalFactId,
  NotificationDetail,
  NotificationDetailOtherDocument,
  NotificationStatus,
  PaymentAttachmentNameType,
  PaymentInfo,
  PaymentNotice,
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
    apiClient.get<NotificationDetail>(NOTIFICATION_DETAIL(iun, mandateId)).then((response) => {
      if (response.data) {
        if (response.data.iun === 'UXNA-LGVN-ENKX-202305-R-1') {
          // eslint-disable-next-line functional/immutable-data
          response.data.timeline = response.data.timeline.concat(([
            {
                "elementId": "GET_ADDRESS.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.SOURCE_GENERAL.ATTEMPT_0",
                "timestamp": "2023-05-02T13:53:41.378791557Z",
                "legalFactsIds": [],
                "category": "GET_ADDRESS",
                "details": {
                    "recIndex": 0,
                    "digitalAddressSource": "GENERAL",
                    "isAvailable": false,
                    "attemptDate": "2023-05-02T13:53:41.378790802Z"
                }
            },
            {
                "elementId": "SCHEDULE_ANALOG_WORKFLOW.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0",
                "timestamp": "2023-05-02T13:53:41.405588033Z",
                "legalFactsIds": [],
                "category": "SCHEDULE_ANALOG_WORKFLOW",
                "details": {
                    "recIndex": 0
                }
            },
            {
                "elementId": "PREPARE_ANALOG_DOMICILE.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.ATTEMPT_0",
                "timestamp": "2023-05-02T13:53:55.431140602Z",
                "legalFactsIds": [],
                "category": "PREPARE_ANALOG_DOMICILE",
                "details": {
                    "recIndex": 0,
                    "physicalAddress": {
                        "at": "Presso",
                        "address": "Via@fail_RIR",
                        "addressDetails": "scala b",
                        "zip": "40100",
                        "municipality": "Milano",
                        "municipalityDetails": "Milano",
                        "province": "MI",
                        "foreignState": "ITALIA"
                    },
                    "sentAttemptMade": 0,
                    "serviceLevel": "REGISTERED_LETTER_890"
                }
            },
            {
                "elementId": "SEND_ANALOG_DOMICILE.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.ATTEMPT_0",
                "timestamp": "2023-05-02T13:53:57.885101524Z",
                "legalFactsIds": [],
                "category": "SEND_ANALOG_DOMICILE",
                "details": {
                    "recIndex": 0,
                    "physicalAddress": {
                        "at": "Presso",
                        "address": "Via@fail_RIR",
                        "addressDetails": "scala b",
                        "zip": "40100",
                        "municipality": "Milano",
                        "municipalityDetails": "Milano",
                        "province": "MI",
                        "foreignState": "ITALIA"
                    },
                    "sentAttemptMade": 0,
                    "serviceLevel": "REGISTERED_LETTER_890",
                    "productType": "890",
                    "analogCost": 421,
                    "numberOfPages": 3,
                    "envelopeWeight": 20,
                    "prepareRequestId": "PREPARE_ANALOG_DOMICILE.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.ATTEMPT_0"
                }
            },
            {
                "elementId": "SEND_ANALOG_PROGRESS.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.ATTEMPT_0.IDX_1",
                "timestamp": "2023-05-02T13:54:05.01Z",
                "legalFactsIds": [],
                "category": "SEND_ANALOG_PROGRESS",
                "details": {
                    "recIndex": 0,
                    "notificationDate": "2023-05-02T13:54:05.01Z",
                    "deliveryDetailCode": "CON080",
                    "sendRequestId": "SEND_ANALOG_DOMICILE.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.ATTEMPT_0",
                    "registeredLetterCode": "60cf97c0c4ae4c9f866ac6cbaf18a870"
                }
            },
            {
                "elementId": "SEND_ANALOG_PROGRESS.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.ATTEMPT_0.IDX_2",
                "timestamp": "2023-05-02T13:54:25.001Z",
                "legalFactsIds": [
                    {
                        "key": "safestorage://PN_EXTERNAL_LEGAL_FACTS-1ba0fd87acd846bea272b887ba4b40cc.pdf",
                        "category": "ANALOG_DELIVERY"
                    }
                ],
                "category": "SEND_ANALOG_PROGRESS",
                "details": {
                    "recIndex": 0,
                    "notificationDate": "2023-05-02T13:54:25.001Z",
                    "deliveryDetailCode": "RECRI004B",
                    "attachments": [
                        {
                            "id": "XNEY-KZMA-RZLW-202305-X-1DOCMock_1|UaMdYj7cAVO6EZTC9ddUBD7pbkG6zdEZ0LaL/3cmphU=",
                            "documentType": "Plico",
                            "url": "safestorage://PN_EXTERNAL_LEGAL_FACTS-1ba0fd87acd846bea272b887ba4b40cc.pdf",
                            "date": "2023-05-02T13:54:25.107Z"
                        }
                    ],
                    "sendRequestId": "SEND_ANALOG_DOMICILE.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.ATTEMPT_0",
                    "registeredLetterCode": "60cf97c0c4ae4c9f866ac6cbaf18a870"
                }
            },
            {
                "elementId": "SEND_ANALOG_FEEDBACK.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.ATTEMPT_0",
                "timestamp": "2023-05-02T13:54:30Z",
                "legalFactsIds": [],
                "category": "SEND_ANALOG_FEEDBACK",
                "details": {
                    "recIndex": 0,
                    "physicalAddress": {
                        "at": "Presso",
                        "address": "Via@fail_RIR",
                        "addressDetails": "scala b",
                        "zip": "40100",
                        "municipality": "Milano",
                        "municipalityDetails": "Milano",
                        "province": "MI",
                        "foreignState": "ITALIA"
                    },
                    "sentAttemptMade": 0,
                    "responseStatus": "KO",
                    "notificationDate": "2023-05-02T13:54:30Z",
                    "deliveryDetailCode": "RECRI004C",
                    "serviceLevel": "REGISTERED_LETTER_890",
                    "sendRequestId": "SEND_ANALOG_DOMICILE.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.ATTEMPT_0",
                    "registeredLetterCode": "60cf97c0c4ae4c9f866ac6cbaf18a870"
                }
            },
            {
                "elementId": "PREPARE_ANALOG_DOMICILE.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.ATTEMPT_1",
                "timestamp": "2023-05-02T13:54:32.299603557Z",
                "legalFactsIds": [],
                "category": "PREPARE_ANALOG_DOMICILE",
                "details": {
                    "recIndex": 0,
                    "sentAttemptMade": 1,
                    "serviceLevel": "REGISTERED_LETTER_890",
                    "relatedRequestId": "PREPARE_ANALOG_DOMICILE.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.ATTEMPT_0"
                }
            },
            {
                "elementId": "ANALOG_FAILURE_WORKFLOW_CREATION_REQUEST.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0",
                "timestamp": "2023-05-02T13:54:56.878868542Z",
                "legalFactsIds": [],
                "category": "ANALOG_FAILURE_WORKFLOW_CREATION_REQUEST",
                "details": {
                    "legalFactId": "safestorage://PN_LEGAL_FACTS-1c4ecfb351704b3c85053e6a8ec5d24c.pdf",
                    "recIndex": 0,
                    "endWorkflowStatus": "FAILURE",
                    "completionWorkflowDate": "2023-05-02T13:54:56.746383009Z"
                }
            },
            {
                "elementId": "ANALOG_FAILURE_WORKFLOW.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0",
                "timestamp": "2023-05-02T13:55:25.503487196Z",
                "legalFactsIds": [],
                "category": "ANALOG_FAILURE_WORKFLOW",
                "details": {
                    "recIndex": 0,
                    "generatedAarUrl": "safestorage://PN_AAR-977b1e882e1845c9ae79945e460816f9.pdf",
                  }
            },
            {
                "elementId": "COMPLETELY_UNREACHABLE.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0",
                "timestamp": "2023-05-02T13:55:25.53752576Z",
                "legalFactsIds": [
                    {
                        "key": "safestorage://PN_LEGAL_FACTS-1c4ecfb351704b3c85053e6a8ec5d24c.pdf",
                        "category": "ANALOG_FAILURE_DELIVERY"
                    }
                ],
                "category": "COMPLETELY_UNREACHABLE",
                "details": {
                    "recIndex": 0
                }
            },
          ] as any) as Array<INotificationDetailTimeline>);

          // eslint-disable-next-line functional/immutable-data
          response.data.notificationStatusHistory[0].relatedTimelineElements = response.data.notificationStatusHistory[0].relatedTimelineElements.concat([
            "GET_ADDRESS.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.SOURCE_GENERAL.ATTEMPT_0",
            "SCHEDULE_ANALOG_WORKFLOW.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0",
            "PREPARE_ANALOG_DOMICILE.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.ATTEMPT_0"
          ]);

          // eslint-disable-next-line functional/immutable-data
          response.data.notificationStatusHistory = response.data.notificationStatusHistory.concat([
            {
              "status": "DELIVERING",
              "activeFrom": "2023-05-02T13:53:57.885101524Z",
              "relatedTimelineElements": [
                  "SEND_ANALOG_DOMICILE.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.ATTEMPT_0",
                  "SEND_ANALOG_PROGRESS.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.ATTEMPT_0.IDX_1",
                  "SEND_ANALOG_PROGRESS.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.ATTEMPT_0.IDX_2",
                  "SEND_ANALOG_FEEDBACK.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.ATTEMPT_0",
                  "PREPARE_ANALOG_DOMICILE.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0.ATTEMPT_1",
                  "ANALOG_FAILURE_WORKFLOW_CREATION_REQUEST.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0",
                  "ANALOG_FAILURE_WORKFLOW.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0"
              ]
            },
            {
                "status": "UNREACHABLE",
                "activeFrom": "2023-05-02T13:55:25.53752576Z",
                "relatedTimelineElements": [
                    "COMPLETELY_UNREACHABLE.IUN_XNEY-KZMA-RZLW-202305-X-1.RECINDEX_0",
                ]
            },  
          ] as any);
          // eslint-disable-next-line functional/immutable-data
          response.data.notificationStatus = NotificationStatus.UNREACHABLE;
        }
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
