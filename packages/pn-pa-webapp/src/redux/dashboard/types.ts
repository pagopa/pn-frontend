export interface Notification {
    iun: string;
}

export enum NotificationStatus {
    RECEIVED = 'RECEIVED',
    DELIVERING = 'DELIVERING',
    DELIVERED = 'DELIVERED',
    VIEWED = 'VIEWED',
    EFFECTIVE_DATE = 'EFFECTIVE_DATE',
    PAID = 'PAID',
    UNREACHABLE = 'UNREACHABLE'
}

export type GetNotificationsParams = {
    startDate: string;
    endDate: string;
    recipientId?: string;
    status?: NotificationStatus;
    subjectRegExp?: string;
};