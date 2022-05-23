import {
  formatDate,
  GetNotificationsParams,
  GetNotificationsResponse,
  LegalFactId,
  NotificationDetail,
  formatFiscalCode,
  parseNotificationDetail,
} from '@pagopa-pn/pn-commons';
import { apiClient, externalClient } from '../axios';

export const NotificationsApi = {
  /**
   * Gets current user notifications
   * @param  {string} startDate
   * @param  {string} endDate
   * @returns Promise
   */
  getSentNotifications: (params: GetNotificationsParams): Promise<GetNotificationsResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append('startDate', params.startDate);
    queryParams.append('endDate', params.endDate);
    if (params.recipientId) {
      queryParams.append('recipientId', formatFiscalCode(params.recipientId));
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
    return apiClient
      .get<GetNotificationsResponse>('/delivery/notifications/sent', { params: queryParams })
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
  getSentNotification: (iun: string): Promise<NotificationDetail> =>
    apiClient.get<NotificationDetail>(`/delivery/notifications/sent/${iun}`).then((response) => {
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
  getSentNotificationDocument: (iun: string, documentIndex: number): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(`/delivery/notifications/sent/${iun}/documents/${documentIndex}`)
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
  getSentNotificationLegalfact: (iun: string, legalFact: LegalFactId): Promise<{ url: string }> =>
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
   * Preload notification document
   * @param  {string} key
   * @param  {string} contentType
   * @returns Promise
   */
  preloadNotificationDocument: (
    items: Array<{ key: string; contentType: string }>
  ): Promise<Array<{ url: string; secret: string; httpMethod: string }>> =>
    apiClient
      .post<{ items: Array<{ url: string; secret: string; httpMethod: string }> }>(
        `/delivery/attachments/preload`,
        {
          items,
        }
      )
      .then((response) => {
        if (response.data && response.data.items) {
          return response.data.items;
        }
        return [];
      }),
  /**
   * Upload notification document
   * @param  {string} url
   * @param  {string} sha256
   * @param  {string} secret
   * @param  {string} fileBase64
   * @returns Promise
   */
  uploadNotificationAttachment: (
    url: string,
    sha256: string,
    secret: string,
    fileBase64: string
  ): Promise<string> =>
    externalClient
      .put<string>(
        url,
        {
          'upload-file': fileBase64,
        },
        {
          headers: {
            'Content-type': 'application/pdf',
            'x-amz-checksum-sha256': sha256,
            'x-amz-meta-secret': secret,
          },
        }
      )
      .then((res) => res.headers['x-amz-version-id']),
};