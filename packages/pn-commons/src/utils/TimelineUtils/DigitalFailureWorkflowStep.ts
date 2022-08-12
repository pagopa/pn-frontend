import { TimelineStep, TimelineStepInfo, TimelineStepPayload } from './TimelineStep';

export class DigitalFailureWorkflowStep extends TimelineStep {
  getTimelineStepInfo(payload: TimelineStepPayload): TimelineStepInfo | null {
    return {
      ...this.localizeTimelineStatus(
        'digital-failure-workflow',
        'Invio per via digitale fallito',
        `L'invio per via digitale della notifica a ${payload.recipient?.denomination} è fallito.`,
        {
          name: payload.recipient?.denomination,
        }
      ),
      recipient: payload.recipientLabel,
    };
  }
}
