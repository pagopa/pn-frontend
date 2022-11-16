import {
  formatDate,
  GetNotificationsParams,
  GetNotificationsResponse,
  LegalFactId,
  NotificationDetail,
  PaymentAttachmentNameType,
  PaymentInfo,
} from '@pagopa-pn/pn-commons';
import { AxiosResponse } from 'axios';

import { Delegator } from '../../redux/delegation/types';
import { parseNotificationDetailForRecipient } from '../../utils/notification.utility';
import { NotificationDetailForRecipient } from '../../models/NotificationDetail';
import { NotificationId } from '../../models/Notifications';
import { apiClient } from '../axios';
import {
  NOTIFICATIONS_LIST,
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_ID_FROM_QRCODE,
  NOTIFICATION_PAYMENT_ATTACHMENT,
  NOTIFICATION_PAYMENT_INFO,
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
  
  exchangeNotificationQrCodeMock: (qrCode: string): Promise<NotificationId> => qrCode === "bad-qrcode" 
    ? Promise.reject({ response: { status: 404 }})
    : (qrCode === "delegated-qrcode" 
        ? Promise.resolve({ iun: 'QPMA-YRWN-WQXL-202211-V-1', mandateId: 'c7f9d779-b6e6-4934-a92a-e6fc85e4d7df' })
        : Promise.resolve({ iun: 'JLGK-XGYT-ERGK-202210-U-1' })
      ),

  exchangeNotificationQrCode: (qrCode: string): Promise<NotificationId> => 
    apiClient.post<NotificationId>(NOTIFICATION_ID_FROM_QRCODE(), { aarQrCodeValue: qrCode })
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
};
