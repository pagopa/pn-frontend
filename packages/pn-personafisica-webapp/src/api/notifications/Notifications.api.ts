import { AxiosResponse } from 'axios';
import {
  formatDate,
  LegalFactId,
  NotificationDetail,
  GetNotificationsParams,
  GetNotificationsResponse,
  parseNotificationDetail,
  PaymentInfo,
  PaymentAttachmentNameType,
  RecipientType,
  DigitalDomicileType,
} from '@pagopa-pn/pn-commons';

import { apiClient } from '../axios';
import {
  NOTIFICATIONS_LIST,
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
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
   * @param  {string} mandateId
   * @returns Promise
   */
  getReceivedNotification: (iun: string, mandateId?: string): Promise<NotificationDetail> =>
    apiClient.get<NotificationDetail>(NOTIFICATION_DETAIL(iun, mandateId)).then((response) => {
      if (response.data && (response.data.iun === "JAHW-EUYQ-ARGL-202207-X-1" || response.data.iun === "PUQA-TWQT-WVME-202207-U-1")) {
        const notification = parseNotificationDetail(response.data);

        // change notification in order to test the right selection of recipient
        const newRecipient = {
          recipientType: RecipientType.PF,
          taxId: 'TTTUUU29J84Z600X',
          denomination: 'Totito',
          digitalDomicile: {
            type: DigitalDomicileType.PEC,
            address: 'letotito@pnpagopa.postecert.local'
          },
          physicalAddress: {
            address: 'Via del mistero, 48',
            zip: '40200',
            municipality: 'Arcore',
            province: 'MI',
            foreignState: 'ITALIA'
          },
          payment: {
            noticeCode: '302011657724564978',
            creditorTaxId: '77777777778',
            pagoPaForm: {
              digests: {
                sha256: 'jezIVxlG1M1woCSUngM6KipUN3/p8cG5RMIPnuEanlE='
              },
              contentType: 'application/pdf',
              ref: {
                key: 'PN_NOTIFICATION_ATTACHMENTS-0001-EWWX-RM6Q-MKZM-VMCV',
                versionToken: 'v1'
              }
            }
          }
        };

        return { ...notification, recipients: [newRecipient, ...notification.recipients] };
      } else if (response.data) {
        return parseNotificationDetail(response.data);
      }
      return {} as NotificationDetail;
    }),
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
      .get<{ url: string }>(NOTIFICATION_PAYMENT_ATTACHMENT(iun, attachmentName as string, mandateId))
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
