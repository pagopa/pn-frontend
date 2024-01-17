import { INotificationDetailTimeline, NotificationDetailRecipient } from '../../types';
export interface TimelineStepPayload {
    step: INotificationDetailTimeline;
    recipient?: NotificationDetailRecipient;
    isMultiRecipient: boolean;
    allStepsForThisStatus?: Array<INotificationDetailTimeline>;
}
export interface TimelineStepInfo {
    label: string;
    description: string;
    linkText?: string;
}
export declare abstract class TimelineStep {
    localizeTimelineStatus(category: string, isMultiRecipient: boolean, defaultLabel: string, defaultDescription: string, data?: {
        [key: string]: string | undefined;
    }): {
        label: string;
        description: string;
    };
    nameAndTaxId(payload: TimelineStepPayload): {
        name: string | undefined;
        taxId: string;
    };
    completePhysicalAddress(step: INotificationDetailTimeline): {
        address: string;
        simpleAddress: string;
    };
    abstract getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null;
}
