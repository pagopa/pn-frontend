import { NotificationStatus } from './NotificationStatus';

export type NotificationCommunicationType = 'LEGAL' | 'INFORMAL';

export interface Notification {
  iun: string;
  paProtocolNumber: string;
  sender: string;
  sentAt: string;
  subject: string;
  notificationStatus: NotificationStatus;
  recipients: Array<string>;
  group?: string;
  mandateId?: string;
}

export interface RecipientNotification extends Notification {
  communicationType: NotificationCommunicationType;
  communicationOutcomes: {
    viewed: boolean;
    delivered: boolean;
  };
  isNewNotification: boolean;
}

export interface GetNotificationsResponse<T extends Notification = Notification> {
  resultsPage: Array<T>;
  moreResult: boolean;
  nextPagesKey: Array<string>;
}

export interface GetNotificationsParams {
  startDate?: Date;
  endDate?: Date;
  mandateId?: string;
  recipientId?: string;
  status?: string;
  subjectRegExp?: string;
  size?: number;
  nextPagesKey?: string;
  iunMatch?: string;
  group?: string;
}

export type NotificationColumnData<T extends Notification = Notification> = T & {
  badge?: string;
  action: string;
};
