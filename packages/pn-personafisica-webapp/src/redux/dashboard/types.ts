export interface Notification {
    iun: string;
    paNotificationId: string;
    senderId: string;
    sentAt: string;
    subject: string;
    notificationStatus: NotificationStatus;
    recipientId: string;
}

export enum NotificationStatus {
    IN_VALIDATION = 'IN_VALIDATION',
    ACCEPTED = 'ACCEPTED',
    REFUSED = 'REFUSED',
    DELIVERING = 'DELIVERING',
    DELIVERED = 'DELIVERED',
    VIEWED = 'VIEWED',
    EFFECTIVE_DATE = 'EFFECTIVE_DATE',
    PAID = 'PAID',
    UNREACHABLE = 'UNREACHABLE',
    CANCELED = 'CANCELED'
}

export interface GetNotificationsResponse {
    result: Array<Notification>;
    moreResult: boolean;
    nextPagesKey: Array<string>;
}

export interface GetNotificationsParams {
    startDate: string;
    endDate: string;
    recipientId?: string;
    iunMatch?: string;
    status?: string;
    subjectRegExp?: string;
    size?: number;
    nextPagesKey?: string;
}