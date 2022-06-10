import {
  formatDate,
  LegalFactId,
  NotificationDetail,
  GetNotificationsParams,
  GetNotificationsResponse,
  parseNotificationDetail,
  PaymentInfo,
  PaymentAttachmentNameType,
  // PaymentInfoDetail,
  PaymentStatus,
  PaymentInfoDetail,
} from '@pagopa-pn/pn-commons';

import { apiClient } from '../axios';
import {
  NOTIFICATIONS_LIST,
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_PAYMENT_ATTACHMENT,
  // NOTIFICATION_PAYMENT_INFO,
} from './notifications.routes';


const mocked_payments_detail = [
  {// 0
    status: PaymentStatus.FAILED,
    detail: PaymentInfoDetail.DOMAIN_UNKNOWN,
    detail_v2: "PPT_STAZIONE_INT_PA_ERRORE_RESPONSE",
    errorCode: "CODICE_ERRORE"
  }, {// 1
    status: PaymentStatus.FAILED,
    detail: PaymentInfoDetail.PAYMENT_UNAVAILABLE,
    detail_v2: "PPT_INTERMEDIARIO_PSP_SCONOSCIUTO",
    errorCode: "CODICE_ERRORE"
  }, {// 2
    status: PaymentStatus.FAILED,
    detail: PaymentInfoDetail.PAYMENT_UNKNOWN,
    detail_v2: "PAA_PAGAMENTO_SCONOSCIUTO",
    errorCode: "CODICE_ERRORE"
  }, {// 3
    status: PaymentStatus.FAILED,
    detail: PaymentInfoDetail.GENERIC_ERROR
  }, {// 4
    status: PaymentStatus.INPROGRESS,
    amount: 47300
  }, {// 5
    status: PaymentStatus.FAILED,
    detail: PaymentInfoDetail.PAYMENT_CANCELED
  }, {// 6
    status: PaymentStatus.FAILED,
    detail: PaymentInfoDetail.PAYMENT_EXPIRED
  },
  // for other cases:
  {// 7
    status: PaymentStatus.SUCCEEDED,
  },{// 8
    status: PaymentStatus.REQUIRED,
    amount: 47300
  },
];

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
  getReceivedNotificationDocument: (iun: string, documentIndex: string): Promise<{ url: string }> =>
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
      .get<{ url: string }>(NOTIFICATION_PAYMENT_ATTACHMENT(iun, attachmentName as string))
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
  // getNotificationPaymentInfo: (noticeCode: string, taxId: string): Promise<PaymentInfo> =>
  //   apiClient
  //     .get<PaymentInfo>(NOTIFICATION_PAYMENT_INFO(taxId, noticeCode))
  //     .then((response) => response.data),
  /**
   * Gets current user's notification payment info
   * @param  {string} noticeCode
   * @param  {string} taxId
   * @returns Promise
   */
  getNotificationPaymentInfo: ( noticeCode: string, taxId: string ): Promise<PaymentInfo> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!noticeCode || !taxId) {
        return reject({ response: { status: 400 }, blockNotification: true });
      }
      // mocked response (returns a random payment status)
      // const randomIndex = Math.floor(Math.random() * 4);
      const randomIndex = 8;
      return resolve(mocked_payments_detail[randomIndex]);
    }, 1000);
    // return resolve(mocked_payments_detail[randomIndex]);
  }),
  // apiClient
  // // .get<PaymentInfo>(`ext-registry/pagopa/v1/paymentinfo/${taxId}/${noticeCode}`)
  // .get<PaymentInfo>(`ext-registry/pagopa/v1/paymentinfo/${taxId ? '77777777777' : 'x'}/${noticeCode ? '302000100000019421' : 'x'}`)
  // // .get<PaymentInfo>(`ext-registry/pagopa/v1/paymentinfo/${taxId ? '77777777777' : 'x'}/${noticeCode ? '302001869076319100' : 'x'}`)
  // // .get<PaymentInfo>(`ext-registry/pagopa/v1/paymentinfo/${taxId ? '77777777777' : 'x'}/${noticeCode ? '002720356512737953' : 'x'}`)
  // // .get<PaymentInfo>(`ext-registry/pagopa/v1/paymentinfo/${taxId ? '00000000000' : 'x'}/${noticeCode ? '002720356084529460' : 'x'}`)
  // .then((response) => response.data),
};
