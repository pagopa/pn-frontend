export type NotificationSortField = 'sentAt' | 'recipients' | 'notificationStatus' | '';

export type NotificationColumn = NotificationSortField | 'subject' | 'iun' | 'group';

export interface CancelNotification {
  iun: string;
}

export interface CancelNotificationResponse {
  status: number;
}
