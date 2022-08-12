import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class ScheduleDigitalWorkflowStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      ...this.localizeTimelineStatus(
        'schedule-digital-workflow',
        'Invio per via digitale in preparazione',
        `L'invio della notifica per via digitale a ${payload.recipient?.denomination} è in preparazione.`,
        {
          name: payload.recipient?.denomination,
        }
      ),
      recipient: payload.recipientLabel,
    };
  }
}
