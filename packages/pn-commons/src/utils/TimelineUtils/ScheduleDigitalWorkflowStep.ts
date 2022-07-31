import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';
import { localizeTimelineStatus } from './TimelineStepFactory';

export class ScheduleDigitalWorkflowStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      ...localizeTimelineStatus(
        'schedule-digital-workflow',
        'Invio per via digitale',
        "È in corso l'invio della notifica per via digitale."
      ),
      linkText: payload.legalFactLabel,
      recipient: payload.recipientLabel,
    };
  }
}
