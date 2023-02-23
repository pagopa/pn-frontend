import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import { INotificationDetailTimeline, NotificationDetailRecipient } from '../../types';

export interface TimelineStepPayload {
  step: INotificationDetailTimeline;
  recipient?: NotificationDetailRecipient;
  recipientLabel?: string;
  isMultiRecipient: boolean;
}

export interface TimelineStepInfo {
  label: string;
  description: string;
  linkText?: string;
  recipient?: string;
}

export abstract class TimelineStep {
  localizeTimelineStatus(
    category: string,
    isMultiRecipient: boolean,
    defaultLabel: string,
    defaultDescription: string,
    data?: { [key: string]: string | undefined }
  ): { label: string; description: string } {
    return {
      label: getLocalizedOrDefaultLabel(
        'notifications',
        `detail.timeline.${category}`,
        defaultLabel
      ),
      description: getLocalizedOrDefaultLabel(
        'notifications',
        `detail.timeline.${category}-description${isMultiRecipient ? '-multirecipient' : ''}`,
        defaultDescription,
        data
      ),
    };
  }

  nameAndTaxId(payload: TimelineStepPayload) {
    return {
      name: payload.recipient?.denomination,
      taxId: payload.recipient ? `(${payload.recipient.taxId})` : '',
    };
  }

  abstract getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null;
}
