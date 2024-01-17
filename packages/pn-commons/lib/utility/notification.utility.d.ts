import { ExtRegistriesPaymentDetails, F24PaymentDetails, INotificationDetailTimeline, LegalFactType, NotificationDetail, NotificationDetailPayment, NotificationDetailRecipient, NotificationStatus, NotificationStatusHistory, PaymentDetails } from '../models';
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
export declare const getF24Payments: (payments: Array<NotificationDetailPayment>, recIndex: number, onlyF24?: boolean) => Array<F24PaymentDetails>;
export declare const getPagoPaF24Payments: (payments: Array<NotificationDetailPayment>, recIndex: number, withLoading?: boolean) => Array<PaymentDetails>;
/**
 * Populate only pagoPA (with eventual f24 associated) payment history array before send notification to fe.
 * @param  {Array<INotificationDetailTimeline>} timeline
 * @param  {Array<PaymentDetails>} pagoPaF24Payemnts
 * @param  {Array<ExtRegistriesPaymentDetails>} checkoutPayments
 * @returns Array<PaymentDetails>
 */
export declare const populatePaymentsPagoPaF24: (timeline: Array<INotificationDetailTimeline>, pagoPaF24Payemnts: Array<PaymentDetails> | Array<NotificationDetailPayment>, checkoutPayments: Array<ExtRegistriesPaymentDetails>) => Array<PaymentDetails>;
export declare function parseNotificationDetail(notificationDetail: NotificationDetail): NotificationDetail;
