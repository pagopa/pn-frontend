import { SendDigitalDetails } from '../../models/NotificationDetail';
import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class ScheduleDigitalWorkflowStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      ...this.localizeTimelineStatus(
        'schedule-digital-workflow',
        payload.isMultiRecipient,
        'Invio per via digitale in preparazione',
        `L'invio della notifica per via digitale a ${payload.recipient?.denomination} è in preparazione.`,
        {
          ...this.nameAndTaxId(payload),
          address: (payload.step.details as SendDigitalDetails).digitalAddress?.address,
        }
      ),
    };
  }
}
