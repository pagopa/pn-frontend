import { NotificationStatus } from './NotificationStatus';

export interface Notification {
  iun: string;
  paProtocolNumber: string;
  sender: string;
  sentAt: string;
  subject: string;
  notificationStatus: NotificationStatus;
  recipients: Array<string>;
  group?: string;
}

export interface GetNotificationsResponse {
  resultsPage: Array<Notification>;
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
  group?: string;
}
