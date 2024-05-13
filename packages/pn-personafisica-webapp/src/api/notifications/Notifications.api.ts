import { NotificationId } from '../../models/Notifications';
import { apiClient } from '../apiClients';
import { NOTIFICATION_ID_FROM_QRCODE } from './notifications.routes';

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
};
