import { INotificationDetailTimeline, NotificationDetailRecipient } from '../../types';

export interface TimelineStepPayload {
  step: INotificationDetailTimeline;
  recipient?: NotificationDetailRecipient;
  recipientLabel?: string;
  legalFactLabel?: string;
  receiptLabel?: string;
}

export interface TimelineStepInfo {
  label: string;
  description: string;
  linkText?: string;
  recipient?: string;
}

export abstract class TimelineStep {
  abstract getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null;
}
