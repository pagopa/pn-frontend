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
  SendPaperDetails,
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
    // eslint-disable-next-line sonarjs/cognitive-complexity
    apiClient.get<NotificationDetail>(NOTIFICATION_DETAIL(iun, mandateId)).then((response) => {
      if (response.data) {
        if (response.data.iun === 'GYJZ-WHRW-LEWJ-202304-K-1') {
          // eslint-disable-next-line functional/immutable-data
          (response.data.timeline.find(elem => elem.category === TimelineCategory.SEND_ANALOG_FEEDBACK)?.details as SendPaperDetails).deliveryFailureCause = "M08";
        } else if (response.data.iun === 'PNEU-QAMA-GRJL-202304-H-1') {
          // eslint-disable-next-line functional/immutable-data
          (response.data.timeline.find(elem => elem.category === TimelineCategory.SEND_ANALOG_FEEDBACK)?.details as SendPaperDetails).deliveryFailureCause = "M04";
        } else if (response.data.iun === 'QYJQ-JLRJ-PGMJ-202304-G-1') {
          // eslint-disable-next-line functional/immutable-data
          (response.data.timeline.find(elem => elem.category === TimelineCategory.SEND_ANALOG_FEEDBACK)?.details as SendPaperDetails).deliveryFailureCause = "M06";
        } else if (response.data.iun === 'NRLT-VAUN-DGJH-202304-V-1') {
          // eslint-disable-next-line functional/immutable-data
          (response.data.timeline.find(elem => elem.category === TimelineCategory.SEND_ANALOG_FEEDBACK)?.details as SendPaperDetails).deliveryFailureCause = "M07";
        } else if (response.data.iun === 'UAUK-VHAJ-WHQH-202304-W-1') {
          // eslint-disable-next-line functional/immutable-data
          (response.data.timeline.find(elem => elem.category === TimelineCategory.SEND_ANALOG_FEEDBACK)?.details as SendPaperDetails).deliveryFailureCause = "M03";
          // aggiungo numero di raccomandata
          const con080steps = response.data.timeline.filter(elem => 
            elem.category === TimelineCategory.SEND_ANALOG_PROGRESS && 
            (elem.details as SendPaperDetails).deliveryDetailCode === 'CON080'
          );
          if (con080steps.length > 0) {
            // eslint-disable-next-line functional/immutable-data
            (con080steps[0].details as SendPaperDetails).registeredLetterCode = "RACC-890-001";
          }
          if (con080steps.length > 1) {
            // eslint-disable-next-line functional/immutable-data
            (con080steps[1].details as SendPaperDetails).registeredLetterCode = "RACC-890-002";
          }
        } else if (response.data.iun === 'WJGU-JNTW-VXKD-202304-G-1') {
          const sendSimpleRegisteredIndex = response.data.timeline.findIndex(elem => elem.category === TimelineCategory.SEND_SIMPLE_REGISTERED_LETTER);
          if (sendSimpleRegisteredIndex > -1) {
            const newStep: INotificationDetailTimeline = {
              category: TimelineCategory.SIMPLE_REGISTERED_LETTER_PROGRESS,
              elementId: 'SIMPLE_REGISTERED_LETTER_PROGRESS_0',
              timestamp: "2023-04-18T13:41:57.918294455Z",
              details: {
                recIndex: 0,
                registeredLetterCode: 'RACC-0-3-3423',
                deliveryDetailCode: 'CON080',
                sendRequestId: 'SEND_SIMPLE_REGISTERED_LETTER.IUN_WJGU-JNTW-VXKD-202304-G-1.RECINDEX_0',
                attachments: []
              }
            };
            // eslint-disable-next-line functional/immutable-data
            // (response.data.timeline[sendSimpleRegisteredIndex].details as SendPaperDetails).productType = "SOSO";
            // eslint-disable-next-line functional/immutable-data
            response.data.timeline.splice(sendSimpleRegisteredIndex + 1, 0, newStep);
            const deliveredStatus = response.data.notificationStatusHistory.find(status => status.status === NotificationStatus.DELIVERED);
            if (deliveredStatus) {
              // eslint-disable-next-line functional/immutable-data
              deliveredStatus.relatedTimelineElements.push('SIMPLE_REGISTERED_LETTER_PROGRESS_0');
            }
          }
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
