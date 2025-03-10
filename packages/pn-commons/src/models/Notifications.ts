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
  mandateId?: string;
}

export interface GetNotificationsResponse {
  resultsPage: Array<Notification>;
  moreResult: boolean;
  nextPagesKey: Array<string>;
}

export interface GetNotificationsParams<TDate extends string | Date> {
  startDate: TDate;
  endDate: TDate;
  mandateId?: string;
  recipientId?: string;
  status?: string;
  subjectRegExp?: string;
  size?: number;
  nextPagesKey?: string;
  iunMatch?: string;
  group?: string;
}

export type NotificationColumnData = Notification & { badge?: string; action:string } ;

