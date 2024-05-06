import {
  ExtRegistriesPaymentDetails,
  GetNotificationsParams,
  GetNotificationsResponse,
  PaymentAttachment,
  PaymentAttachmentNameType,
  PaymentNotice,
} from '@pagopa-pn/pn-commons';

import { NotificationId } from '../../models/Notifications';
import { apiClient } from '../apiClients';
import {
  NOTIFICATIONS_LIST,
  NOTIFICATION_ID_FROM_QRCODE,
  NOTIFICATION_PAYMENT_ATTACHMENT,
  NOTIFICATION_PAYMENT_INFO,
  NOTIFICATION_PAYMENT_URL,
} from './notifications.routes';

export const NotificationsApi = {
  /**
   * Gets current user notifications
   * @param  {string} startDate
   * @param  {string} endDate
   * @returns Promise
   */
  getReceivedNotifications: (
    params: GetNotificationsParams<string>
  ): Promise<GetNotificationsResponse> =>
    apiClient.get<GetNotificationsResponse>(NOTIFICATIONS_LIST(params)).then((response) => {
      if (response.data && response.data.resultsPage) {
        return response.data;
      }
      return {
        resultsPage: [],
        moreResult: false,
        nextPagesKey: [],
      };
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
   * Gets current user specified Payment Attachment
   * @param  {string} iun
   * @param  {PaymentAttachmentNameType} attachmentName
   * @param  {number} recIndex
   * @param  {string} mandateId
   * @param  {number} attachmentIdx
   * @returns Promise
   */
  getPaymentAttachment: (
    iun: string,
    attachmentName: PaymentAttachmentNameType,
    mandateId?: string,
    attachmentIdx?: number
  ): Promise<PaymentAttachment> =>
    apiClient
      .get<PaymentAttachment>(
        NOTIFICATION_PAYMENT_ATTACHMENT(iun, attachmentName as string, mandateId, attachmentIdx)
      )
      .then((response) => response.data),

  /**
   * Gets current user's notification payment info
   * @returns Promise
   */
  getNotificationPaymentInfo: (
    params: Array<{ noticeCode: string; creditorTaxId: string }>
  ): Promise<Array<ExtRegistriesPaymentDetails>> =>
    apiClient
      .post<Array<ExtRegistriesPaymentDetails>>(NOTIFICATION_PAYMENT_INFO(), params)
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
