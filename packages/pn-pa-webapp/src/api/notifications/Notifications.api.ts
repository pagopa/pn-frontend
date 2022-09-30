import { AxiosResponse } from 'axios';
import {
  formatDate,
  GetNotificationsParams,
  GetNotificationsResponse,
  LegalFactId,
  NotificationDetail,
  parseNotificationDetail,
} from '@pagopa-pn/pn-commons';

import { NewNotificationDTO, NewNotificationResponse } from '../../models/NewNotification';
import { GroupStatus, UserGroup } from '../../models/user';
import { apiClient, externalClient } from '../axios';
import {
  CREATE_NOTIFICATION,
  NOTIFICATIONS_LIST,
  NOTIFICATION_DETAIL,
  NOTIFICATION_DETAIL_DOCUMENTS,
  NOTIFICATION_DETAIL_LEGALFACT,
  NOTIFICATION_PRELOAD_DOCUMENT,
  GET_USER_GROUPS,
} from './notifications.routes';


/* eslint-disable-next-line functional/no-let */
let callCounter = 0;


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
  getSentNotifications: (params: GetNotificationsParams): Promise<GetNotificationsResponse> =>
    apiClient.get<GetNotificationsResponse>(NOTIFICATIONS_LIST(params)).then((response) => {
      callCounter++;
      if (callCounter % 3 === 0) {
        return Promise.reject({ response: { status: 500 }});
      }
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
  getSentNotification: (iun: string): Promise<NotificationDetail> =>
    apiClient.get<NotificationDetail>(NOTIFICATION_DETAIL(iun)).then((response) => {
      callCounter++;
      if (callCounter % 5 === 0) {
        return Promise.reject({ response: { status: 500 } });
      }
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
  getSentNotificationDocument: (iun: string, documentIndex: string): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(NOTIFICATION_DETAIL_DOCUMENTS(iun, documentIndex))
      .then((response) => getDownloadUrl(response)),

  /**
   * Gets current user notification legalfact
   * @param  {string} iun
   * @param  {LegalFactId} legalFact
   * @returns Promise
   */
  getSentNotificationLegalfact: (iun: string, legalFact: LegalFactId): Promise<{ url: string }> =>
    apiClient
      .get<{ url: string }>(NOTIFICATION_DETAIL_LEGALFACT(iun, legalFact))
      .then((response) => getDownloadUrl(response)),

  /**
   * get user groups
   * @param  {GroupStatus} status
   * @returns Promise
   */
  getUserGroups: (status?: GroupStatus): Promise<Array<UserGroup>> =>
    apiClient.get<Array<UserGroup>>(GET_USER_GROUPS(status)).then((response) => { 
      callCounter++;
      if (callCounter % 2 === 0) {
        return Promise.reject({ response: { status: 500 } });
      }
      return response.data; 
    }),

  /**
   * Preload notification document
   * @param  {string} key
   * @param  {string} contentType
   * @returns Promise
   */
  preloadNotificationDocument: (
    items: Array<{ key: string; contentType: string; sha256: string }>
  ): Promise<Array<{ url: string; secret: string; httpMethod: string; key: string }>> =>
    apiClient
      .post<Array<{ url: string; secret: string; httpMethod: string; key: string }>>(
        NOTIFICATION_PRELOAD_DOCUMENT(),
        items
      )
      .then((response) => {
        if (response.data) {
          return response.data;
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
    file: Uint8Array,
    httpMethod: string
  ): Promise<string> => {
    const method = httpMethod.toLowerCase() as 'get' | 'post' | 'put';
    return externalClient[method]<string>(url, file, {
      headers: {
        'Content-Type': 'application/pdf',
        'x-amz-meta-secret': secret,
        'x-amz-checksum-sha256': sha256,
      },
    }).then((res) => res.headers['x-amz-version-id']);
  },

  /**
   * create new notification
   * @param  {NewNotificationDTO} notification
   * @returns Promise
   */
  createNewNotification: (notification: NewNotificationDTO): Promise<NewNotificationResponse> =>
    apiClient
      .post<NewNotificationResponse>(CREATE_NOTIFICATION(), notification)
      .then((response) => response.data),
};
