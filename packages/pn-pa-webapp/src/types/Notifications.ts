export type NotificationSortField = 'sentAt' | 'recipients' | 'notificationStatus' | '';

export type NotificationColumn =
  | NotificationSortField
  | 'subject'
  | 'iun'
  | 'group';
