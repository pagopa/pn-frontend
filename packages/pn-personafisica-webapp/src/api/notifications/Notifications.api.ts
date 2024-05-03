import { AxiosResponse } from 'axios';

import {
  ExtRegistriesPaymentDetails,
  LegalFactId,
  NotificationDetailOtherDocument,
  PaymentAttachment,
  PaymentAttachmentNameType,
  PaymentNotice,
} from '@pagopa-pn/pn-commons';

import { NotificationId } from '../../models/Notifications';
import { DocType, DownloadFileResponse } from '../../redux/notification/types';
import { apiClient } from '../apiClients';
import {
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_DETAIL_OTHER_DOCUMENTS,
  NOTIFICATION_ID_FROM_QRCODE,
  NOTIFICATION_PAYMENT_ATTACHMENT,
  NOTIFICATION_PAYMENT_INFO,
  NOTIFICATION_PAYMENT_URL,
} from './notifications.routes';

const getDownloadUrl = (response: AxiosResponse, docType?: DocType): DownloadFileResponse => {
  if (response.data) {
    return { ...response.data, docType } as DownloadFileResponse;
  }
  return { url: '' } as DownloadFileResponse;
};

export const NotificationsApi = {
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
   * Gets current user notification document aka Atto Notificato
   * @param  {string} iun
   * @param  {number} documentIndex
   * @param  {string} mandateId
   * @returns Promise
   */
  getReceivedNotificationDocument: (
    iun: string,
    documentIndex: string,
    mandateId?: string
  ): Promise<DownloadFileResponse> =>
    apiClient
      .get<DownloadFileResponse>(NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex, mandateId))
      .then((response) => getDownloadUrl(response)),

  /**
   * Get notification AAR document
   * @param  {string} iun
   * @param  {NotificationDetailOtherDocument} otherDocument
   * @returns Promise
   */
  getReceivedNotificationOtherDocument: (
    iun: string,
    otherDocument: NotificationDetailOtherDocument,
    mandateId?: string
  ): Promise<DownloadFileResponse> =>
    apiClient
      .get<DownloadFileResponse>(NOTIFICATION_DETAIL_OTHER_DOCUMENTS(iun, otherDocument), {
        params: { documentId: otherDocument.documentId, mandateId },
      })
      .then((response) => getDownloadUrl(response, DocType.AAR)),

  /**
   * Gets current user notification legalfact aka AO3
   * @param  {string} iun
   * @param  {LegalFactId} legalFact
   * @param  {string} mandateId
   * @returns Promise
   */
  getReceivedNotificationLegalfact: (
    iun: string,
    legalFact: LegalFactId,
    mandateId?: string
  ): Promise<DownloadFileResponse> =>
    apiClient
      .get<DownloadFileResponse>(NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact, mandateId))
      .then((response) => getDownloadUrl(response, DocType.AO3)),

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
