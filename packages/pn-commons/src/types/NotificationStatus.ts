export enum NotificationStatus {
  IN_VALIDATION = 'IN_VALIDATION',
  ACCEPTED = 'ACCEPTED',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  VIEWED = 'VIEWED',
  EFFECTIVE_DATE = 'EFFECTIVE_DATE',
  PAID = 'PAID',
  UNREACHABLE = 'UNREACHABLE',
  CANCELLED = 'CANCELLED',
  REFUSED = 'REFUSED',
  // only fe
  VIEWED_AFTER_DEADLINE = 'VIEWED_AFTER_DEADLINE'
}