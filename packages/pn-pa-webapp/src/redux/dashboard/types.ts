import { NotificationStatus } from "@pagopa-pn/pn-commons";

export interface Notification {
    iun: string;
    paNotificationId: string;
    senderId: string;
    sentAt: string;
    subject: string;
    notificationStatus: NotificationStatus;
    recipientId: string;
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
    status?: string;
    subjectRegExp?: string;
    size?: number;
    nextPagesKey?: string;
}