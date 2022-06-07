import {
  formatDate,
  LegalFactId,
  NotificationDetail,
  GetNotificationsParams,
  GetNotificationsResponse,
  parseNotificationDetail,
  PaymentInfo,
  PaymentAttachmentNameType,
} from '@pagopa-pn/pn-commons';

import { apiClient } from '../axios';
import {
  NOTIFICATIONS_LIST,
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
} from './notifications.routes';

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
   * @returns Promise
   */
  getReceivedNotification: (iun: string): Promise<NotificationDetail> =>
    apiClient.get<NotificationDetail>(NOTIFICATION_DETAIL(iun)).then((response) => {
      if (response.data) {
        return parseNotificationDetail(response.data);
      }
      return {} as NotificationDetail;
    }),
  /**
   * Gets current user notification document
   * @param  {string} iun
   * @param  {number} documentIndex
   * @returns Promise
   */
  getReceivedNotificationDocument: (iun: string, documentIndex: number): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex))
      .then((response) => {
        if (response.data) {
          return response.data;
        }
        return { url: '' };
      }),
  /**
   * Gets current user notification legalfact
   * @param  {string} iun
   * @param  {LegalFactId} legalFact
   * @returns Promise
   */
  getReceivedNotificationLegalfact: (
    iun: string,
    legalFact: LegalFactId
  ): Promise<{ url: string }> =>
    apiClient
      .get<Buffer>(NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact), {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      })
      .then((response) => {
        if (response.data) {
          const blob = new Blob([response.data], { type: 'application/pdf' });
          return { url: window.URL.createObjectURL(blob) };
        }
        return { url: '' };
      }),
  /**
   * Gets current user specified Payment Attachment
   * @param  {string} iun
   * @param  {PaymentAttachmentNameType} attachmentName
   * @returns Promise
   */
  getPaymentAttachment: (
    iun: string,
    attachmentName: PaymentAttachmentNameType
  ): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(
        `/delivery/notifications/received/${iun}/attachments/payment/${attachmentName}`
      )
      .then((response) => {
        if (response.data) {
          return { url: response.data.url };
        }
        return { url: '' };
      }),
  /**
   * Gets current user's notification payment info
   * @param  {string} noticeCode
   * @param  {string} taxId
   * @returns Promise
   */
  getNotificationPaymentInfo: (noticeCode: string, taxId: string): Promise<PaymentInfo> =>
    apiClient
      .get<PaymentInfo>(`ext-registry/pagopa/v1/paymentinfo/${taxId}/${noticeCode}`)
      .then((response) => response.data),
};
