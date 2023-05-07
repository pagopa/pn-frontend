export type NotificationColumn =
  | 'notificationStatus'
  | 'sentAt'
  | 'sender'
  | 'recipients'
  | 'senderId'
  | 'subject'
  | 'iun'
  | 'status'
  | 'menu'
  | '';

export type NotificationId = { iun: string; mandateId?: string };
