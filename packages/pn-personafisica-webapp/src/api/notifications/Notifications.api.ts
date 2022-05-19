import {
  formatDate,
  LegalFactId,
  NotificationDetail,
  GetNotificationsParams,
  GetNotificationsResponse,
  formatFiscalCode,
  parseNotificationDetail,
  PaymentInfo,
  PaymentStatus,
  PaymentAttachmentNameType,
} from '@pagopa-pn/pn-commons';
import { apiClient } from '../axios';

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
    const queryParams = new URLSearchParams();
    queryParams.append('startDate', params.startDate);
    queryParams.append('endDate', params.endDate);
    if (params.recipientId) {
      queryParams.append('senderId', formatFiscalCode(params.recipientId));
    }
    if (params.status) {
      queryParams.append('status', params.status);
    }
    if (params.subjectRegExp) {
      queryParams.append('subjectRegExp', params.subjectRegExp);
    }
    if (params.size) {
      queryParams.append('size', params.size.toString());
    }
    if (params.nextPagesKey) {
      queryParams.append('nextPagesKey', params.nextPagesKey);
    }
    if (params.iunMatch) {
      queryParams.append('iunMatch', params.iunMatch);
    }
    if (params.mandateId) {
      queryParams.append('mandateId', params.mandateId);
    }
    return apiClient
      .get<GetNotificationsResponse>('/delivery/notifications/received', { params: queryParams })
      .then((response) => {
        if (response.data && response.data.result) {
          const notifications = response.data.result.map((d) => ({
            ...d,
            sentAt: formatDate(d.sentAt),
          }));
          return {
            ...response.data,
            result: notifications,
          };
        }
        return {
          result: [],
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
      .get<NotificationDetail>(`/delivery/notifications/received/${iun}`)
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
      .get<{ url: string }>(`/delivery/notifications/received/${iun}/documents/${documentIndex}`)
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
      .get<Buffer>(`/delivery-push/legalfacts/${iun}/${legalFact.type}/${legalFact.key}`, {
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
      .get<{ url: string }>(`/delivery/notifications/received/${iun}/attachments/payment/${attachmentName}`)
      .then((response) => {
        if (response.data) {
          return { url: response.data.url };
        }
        return { url: '' };
      }),
  /**
   * Gets current user's notification payment info
   * @param  {string} iuv
   * @returns Promise
   */
  getNotificationPaymentInfo: ( noticeCode: string, taxId: string ): Promise<PaymentInfo> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!noticeCode || ! taxId) {
          return reject({ response: { status: 400 }, blockNotification: true });
        }
        // mocked response (returns a random payment status)
        const randomIndex = Math.floor(Math.random() * 4);
        return resolve(mocked_payments_detail[randomIndex]);
      }, 1500);
      // return resolve(mocked_payments_detail[randomIndex]);
    }),
  // apiClient
  // .get<PaymentInfo>(`ext-registry/pagopa/v1/paymentinfo/{taxId}/{noticeCode}`)
  // .then((response) => {
  //   if (response.data) {
  //     return response.data;
  //   }
  //   return { };
  //   // return response.data;
  // }),
};
