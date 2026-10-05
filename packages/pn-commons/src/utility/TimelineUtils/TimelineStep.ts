import {
  AnalogWorkflowDetails,
  INotificationDetailTimeline,
  NotificationDetailRecipient,
  PhysicalAddress,
} from '../../models/NotificationDetail';
import { getLocalizedOrDefaultLabel, hasLocalizedLabel } from '../../utility/localization.utility';

export interface TimelineStepPayload {
  step: INotificationDetailTimeline;
  recipient?: NotificationDetailRecipient;
  isMultiRecipient: boolean;
  allStepsForThisStatus?: Array<INotificationDetailTimeline>;
  delegatorName?: string;
}

export interface TimelineStepInfo {
  label: string;
  description: string;
}

export abstract class TimelineStep {
  localizeTimelineStatus(
    category: string,
    isMultiRecipient: boolean,
    defaultLabel?: string,
    defaultDescription?: string,
    data?: { [key: string]: string | undefined },
    delegatorName?: string
  ): { label: string; description: string } {
    return {
      label: getLocalizedOrDefaultLabel(
        'notifications',
        `detail.timeline.${category}`,
        defaultLabel
      ),
      description: this.localizeDescription(
        `detail.timeline.${category}-description`,
        isMultiRecipient,
        defaultDescription,
        data,
        delegatorName
      ),
    };
  }

  localizeDescription(
    path: string,
    isMultiRecipient: boolean,
    defaultDescription?: string,
    data?: { [key: string]: string | undefined },
    delegatorName?: string
  ): string {
    const delegatePath = `${path}-delegate`;
    if (delegatorName && hasLocalizedLabel('notifications', delegatePath)) {
      return getLocalizedOrDefaultLabel('notifications', delegatePath, defaultDescription, {
        ...data,
        recipient: delegatorName,
      });
    }

    return getLocalizedOrDefaultLabel(
      'notifications',
      `${path}${isMultiRecipient ? '-multirecipient' : ''}`,
      defaultDescription,
      data
    );
  }

  nameAndTaxId(payload: TimelineStepPayload) {
    return {
      name: payload.recipient?.denomination,
      taxId: payload.recipient ? `(${payload.recipient.taxId})` : '',
    };
  }

  completePhysicalAddressFromStep(step: INotificationDetailTimeline) {
    return this.completePhysicalAddressFromAddress(
      (step.details as AnalogWorkflowDetails).physicalAddress
    );
  }

  completePhysicalAddressFromAddress(physicalAddress?: PhysicalAddress) {
    const zip = physicalAddress?.zip ? ` (${physicalAddress.zip})` : '';
    const city = physicalAddress?.municipality ? ` - ${physicalAddress.municipality}` : '';
    const country = physicalAddress?.foreignState ? ` ${physicalAddress.foreignState}` : '';
    return {
      address: physicalAddress ? `${physicalAddress.address}${city}${zip}${country}` : '',
      simpleAddress: physicalAddress ? physicalAddress.address : '',
    };
  }

  abstract getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null;
}
