import { NotificationStatus } from './NotificationStatus';

export interface Notification {
  iun: string;
  paNotificationId: string;
  senderId: string;
  sentAt: string;
  subject: string;
  notificationStatus: NotificationStatus;
  recipientId: string;
  group?: string;
}

export interface GetNotificationsResponse {
  result: Array<Notification>;
  moreResult: boolean;
  nextPagesKey: Array<string>;
}

export interface GetNotificationsParams {
  startDate: string;
  endDate: string;
  mandateId?: string;
  recipientId?: string;
  status?: string;
  subjectRegExp?: string;
  size?: number;
  nextPagesKey?: string;
  iunMatch?: string;
}
