import {
  formatDate,
  LegalFactId,
  NotificationDetail,
  GetNotificationsParams,
  GetNotificationsResponse,
  parseNotificationDetail,
  PaymentDetail,
  PaymentStatus,
} from '@pagopa-pn/pn-commons';

import { apiClient } from '../axios';
import { NOTIFICATIONS_LIST, NOTIFICATION_DETAIL, NOTIFICATION_DETAIL_DOCUMENTS, NOTIFICATION_DETAIL_LEGALFACT } from './notifications.routes';

const mocked_payments_detail = [
  {
    amount: 47350,
    status: PaymentStatus.REQUIRED,
  },
  {
    amount: 47350,
    status: PaymentStatus.INPROGRESS,
  },
  {
    status: PaymentStatus.SUCCEEDED,
  },
  {
    amount: 47350,
    status: PaymentStatus.FAILED,
  },
];

export const NotificationsApi = {
  /**
   * Gets current user notifications
   * @param  {string} startDate
   * @param  {string} endDate
   * @returns Promise
   */
  getReceivedNotifications: (params: GetNotificationsParams): Promise<GetNotificationsResponse> => {
    return apiClient
      .get<GetNotificationsResponse>(NOTIFICATIONS_LIST(params))
      .then((response) => {
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
   * @returns Promise
   */
  getReceivedNotification: (iun: string): Promise<NotificationDetail> =>
    apiClient
      .get<NotificationDetail>(NOTIFICATION_DETAIL(iun))
      .then((response) => {
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
   * Gets current user's notification payment info
   * @param  {string} iuv
   * @returns Promise
   */
  getNotificationPaymentInfo: (iuv: string): Promise<PaymentDetail> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!iuv) {
          return reject({ response: { status: 400 }, blockNotification: true });
        }
        // mocked response (returns a random payment status)
        const randomIndex = Math.floor(Math.random() * 4);
        return resolve(mocked_payments_detail[randomIndex]);
      }, 1500);
      // return resolve(mocked_payments_detail[randomIndex]);
    }),
  // apiClient
  // .get<PaymentDetail>(NOTIFICATION_DETAIL_PAYMENT(iuv))
  // .then((response) => {
  //   if (response.data) {
  //     return response.data;
  //   }
  //   return { };
  //   // return response.data;
  // }),
};
