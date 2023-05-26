import {
  formatDate,
  GetNotificationsParams,
  GetNotificationsResponse,
  LegalFactId,
  NotificationDetail,
  NotificationDetailOtherDocument,
  PaymentAttachmentNameType,
  PaymentInfo,
  PaymentNotice,
} from '@pagopa-pn/pn-commons';
import { AxiosResponse } from 'axios';

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
   * @param {GetNotificationsParams & { isDelegatedPage: boolean }} params
   *
   * @returns Promise
   */
  getReceivedNotifications:
    (params: GetNotificationsParams & { isDelegatedPage: boolean }): Promise<GetNotificationsResponse> => {
      const { isDelegatedPage, ...payload } = params;
      return apiClient.get<GetNotificationsResponse>(NOTIFICATIONS_LIST(payload, isDelegatedPage)).then((response) => {
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
      });
  },

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
    mandateId?: string
  ): Promise<NotificationDetailForRecipient> =>
    apiClient.get<NotificationDetail>(NOTIFICATION_DETAIL(iun, mandateId)).then((response) => {
      if (response.data) {
        return parseNotificationDetailForRecipient(response.data);
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
