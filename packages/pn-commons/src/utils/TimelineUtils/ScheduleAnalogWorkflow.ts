import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';
import { localizeTimelineStatus } from './TimelineStepFactory';

export class ScheduleAnalogWorkflowStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      ...localizeTimelineStatus(
        'schedule-analog-workflow',
        'Invio per via cartacea',
        "L'invio della notifica per via cartacea è in preparazione."
      ),
      linkText: payload.legalFactLabel,
      recipient: payload.recipientLabel,
    };
  }
}
