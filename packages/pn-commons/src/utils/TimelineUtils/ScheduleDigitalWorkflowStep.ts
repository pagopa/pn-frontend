import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class ScheduleDigitalWorkflowStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      ...this.localizeTimelineStatus(
        'schedule-digital-workflow',
        'Invio per via digitale',
        "È in corso l'invio della notifica per via digitale."
      ),
      recipient: payload.recipientLabel,
    };
  }
}
