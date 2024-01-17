import { INotificationDetailTimeline, NotificationDetailRecipient, NotificationDetail, NotificationStatus, NotificationStatusHistory, LegalFactType } from '../types';
import { TimelineStepInfo } from './TimelineUtils/TimelineStep';
/**
 * Returns the mapping between current notification status and its color, label and descriptive message.
 * @param  {NotificationStatus} status
 * @returns object
 */
export declare function getNotificationStatusInfos(status: NotificationStatus | NotificationStatusHistory, options?: {
    recipients: Array<NotificationDetailRecipient | string>;
}): {
    color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
    label: string;
    tooltip: string;
    description: string;
};
export declare const getNotificationAllowedStatus: () => {
    value: string;
    label: string;
}[];
/**
 * Get legalFact label based on timeline step and legalfact type.
 * @param {INotificationDetailTimeline} timelineStep Timeline step
 * @param {LegalFactType} legalFactType Legalfact type
 * @returns {string} attestation or receipt
 */
export declare function getLegalFactLabel(timelineStep: INotificationDetailTimeline, legalFactType?: LegalFactType, legalFactKey?: string): string;
/**
 * Returns the mapping between current notification timeline status and its label and descriptive message.
 * @param  {INotificationDetailTimeline} step
 * @param {Array<NotificationDetailRecipient>} recipients
 * @returns {TimelineStepInfo | null}
 */
export declare function getNotificationTimelineStatusInfos(step: INotificationDetailTimeline, recipients: Array<NotificationDetailRecipient>, allStepsForThisStatus?: Array<INotificationDetailTimeline>): TimelineStepInfo | null;
export declare function parseNotificationDetail(notificationDetail: NotificationDetail): NotificationDetail;
