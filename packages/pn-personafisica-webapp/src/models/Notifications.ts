export type NotificationColumn =
  | 'notificationStatus'
  | 'sentAt'
  | 'sender'
  | 'senderId'
  | 'subject'
  | 'iun'
  | 'status'
  | '';

export type NotificationId = { iun: string; mandateId?: string };
