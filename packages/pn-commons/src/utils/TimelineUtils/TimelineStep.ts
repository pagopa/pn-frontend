import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import { AnalogWorkflowDetails, INotificationDetailTimeline, NotificationDetailRecipient } from '../../types';

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

  completePhysicalAddress(payload: TimelineStepPayload) {
    const physicalAddress = (payload.step.details as AnalogWorkflowDetails).physicalAddress;
    const zip = physicalAddress && physicalAddress.zip ? ` (${physicalAddress.zip})` : '';
    const city = physicalAddress && physicalAddress?.municipality ? ` - ${physicalAddress.municipality}` : '';
    const country = physicalAddress && physicalAddress.foreignState ? ` ${physicalAddress.foreignState}` : '';
    return {
      address: physicalAddress ? `${physicalAddress.address}${city}${zip}${country}` : '',
      simpleAddress: physicalAddress ? physicalAddress.address : '',
    };
  }

  abstract getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null;
}
