import { PaymentAttachment, PaymentAttachmentNameType } from '@pagopa-pn/pn-commons';

import { NewNotificationDTO, NewNotificationResponse } from '../../models/NewNotification';
import { GroupStatus, UserGroup } from '../../models/user';
import { apiClient, externalClient } from '../apiClients';
import {
  CREATE_NOTIFICATION,
  GET_USER_GROUPS,
  NOTIFICATION_PAYMENT_ATTACHMENT,
  NOTIFICATION_PRELOAD_DOCUMENT,
} from './notifications.routes';

export const NotificationsApi = {
  /**
   * Get user groups
   * @param  {GroupStatus} status
   * @returns Promise
   */
  getUserGroups: (status?: GroupStatus): Promise<Array<UserGroup>> =>
    apiClient.get<Array<UserGroup>>(GET_USER_GROUPS(status)).then((response) => response.data),

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
   * Create new notification
   * @param  {NewNotificationDTO} notification
   * @returns Promise
   */
  createNewNotification: (notification: NewNotificationDTO): Promise<NewNotificationResponse> =>
    apiClient
      .post<NewNotificationResponse>(CREATE_NOTIFICATION(), notification)
      .then((response) => response.data),

  /**
   * Gets current user specified Payment Attachment
   * @param  {string} iun
   * @param  {PaymentAttachmentNameType} attachmentName
   * @param  {number} recIndex
   * @param  {number} attachmentIdx
   * @returns Promise
   */
  getPaymentAttachment: (
    iun: string,
    attachmentName: PaymentAttachmentNameType,
    recIndex: number,
    attachmentIdx?: number
  ): Promise<PaymentAttachment> =>
    apiClient
      .get<PaymentAttachment>(
        NOTIFICATION_PAYMENT_ATTACHMENT(iun, attachmentName as string, recIndex, attachmentIdx)
      )
      .then((response) => response.data),
};
