import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class ScheduleAnalogWorkflowStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      ...this.localizeTimelineStatus(
        'schedule-analog-workflow',
        'Invio per via cartacea',
        "L'invio della notifica per via cartacea è in preparazione."
      ),
      recipient: payload.recipientLabel,
    };
  }
}
